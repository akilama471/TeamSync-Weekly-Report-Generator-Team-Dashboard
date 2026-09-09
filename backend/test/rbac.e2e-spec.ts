import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('RBAC Security & Review Workflow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let memberAToken: string;
  let memberBToken: string;
  let managerToken: string;
  let memberAReportId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Login Member A (Akila)
    const resMemberA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'akila@company.com', password: 'password123' });
    memberAToken = resMemberA.body.accessToken;

    // Login Member B (Kasun)
    const resMemberB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'kasun@company.com', password: 'password123' });
    memberBToken = resMemberB.body.accessToken;

    // Login Manager (Sarah)
    const resManager = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'manager@company.com', password: 'password123' });
    managerToken = resManager.body.accessToken;

    // Find a report belonging to Member A
    const repA = await prisma.report.findFirst({
      where: { user: { email: 'akila@company.com' } },
    });
    if (repA) {
      memberAReportId = repA.id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Unauthenticated Access Protection', () => {
    it('GET /reports without token should return 401 Unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/reports')
        .expect(401);
    });

    it('GET /dashboard/summary without token should return 401 Unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/dashboard/summary')
        .expect(401);
    });
  });

  describe('2. Team Member Isolation (Horizontal RBAC)', () => {
    it('Team Member B cannot access Team Member A private report (403 Forbidden)', async () => {
      if (!memberAReportId) return;

      const response = await request(app.getHttpServer())
        .get(`/reports/${memberAReportId}`)
        .set('Authorization', `Bearer ${memberBToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });

    it('Team Member A can successfully access their own report (200 OK)', async () => {
      if (!memberAReportId) return;

      const response = await request(app.getHttpServer())
        .get(`/reports/${memberAReportId}`)
        .set('Authorization', `Bearer ${memberAToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(memberAReportId);
    });
  });

  describe('3. Privilege Escalation Protection (Vertical RBAC)', () => {
    it('Team Member cannot approve a report (403 Forbidden)', async () => {
      if (!memberAReportId) return;

      const response = await request(app.getHttpServer())
        .post(`/reviews/${memberAReportId}/approve`)
        .set('Authorization', `Bearer ${memberAToken}`)
        .send({ comment: 'Self approving report' });

      expect(response.status).toBe(403);
    });

    it('Team Member cannot request changes on a report (403 Forbidden)', async () => {
      if (!memberAReportId) return;

      const response = await request(app.getHttpServer())
        .post(`/reviews/${memberAReportId}/request-correction`)
        .set('Authorization', `Bearer ${memberBToken}`)
        .send({ comment: 'Malicious review' });

      expect(response.status).toBe(403);
    });

    it('Team Member cannot access Manager Dashboard API (403 Forbidden)', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboard/summary')
        .set('Authorization', `Bearer ${memberAToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('4. Manager Permissions', () => {
    it('Manager can view any team member report (200 OK)', async () => {
      if (!memberAReportId) return;

      const response = await request(app.getHttpServer())
        .get(`/reports/${memberAReportId}`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(memberAReportId);
    });

    it('Manager can view executive dashboard summary (200 OK)', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboard/summary')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('submittedCount');
      expect(response.body).toHaveProperty('complianceRate');
    });
  });
});
