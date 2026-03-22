import { Pool } from 'pg';

// Demo data generation (copied from src/lib/generate-demo-data.ts to avoid path alias issues)
interface Idem {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isSeeded: boolean;
}

const AUTHORS = [
  "Alice Developer",
  "Bob Engineer",
  "Charlie Ops",
  "Diana SRE",
  "Eve Architect",
  "Frank DevSecOps",
  "Grace Platform",
  "Henry Infra",
  "Iris CloudOps",
  "Jack Pipeline",
  "Kate Containers",
  "Leo Terraform",
];

const SHORT_CONTENTS = [
  "CI/CD pipeline looking smooth today!",
  "Just fixed that flaky test. Finally!",
  "Monitoring dashboards looking clean today!",
  "Love a good zero-downtime deployment.",
  "Kubernetes is humming along nicely.",
  "Infrastructure as Code for the win!",
  "Another successful release to production.",
  "Coffee + debugging = productivity.",
  "Git rebase complete. Clean history!",
  "Docker containers spinning up perfectly.",
  "Load balancer configured correctly.",
  "SSL certificates renewed automatically.",
  "Autoscaling kicked in just in time.",
  "Database migrations ran smoothly.",
  "Feature flags are so powerful!",
  "Canary deployment looking good.",
  "Blue-green deployment successful!",
  "Rollback completed in 30 seconds.",
  "Alert fatigue is real. Tuning now.",
  "SLA target: 99.9%. Achieved: 99.95%!",
];

const MEDIUM_CONTENTS = [
  "Pro tip: Always make your health checks idempotent. Running them 100 times should have the same effect as running them once. Your on-call self will thank you.",
  "TIL: Idempotent APIs are crucial for retry logic. If a request fails and you retry it, you want the same result - not duplicate side effects!",
  "Infrastructure as Code means your deployments are reproducible. Run terraform apply 10 times, get the same infrastructure. That's idempotency in practice!",
  "CI/CD pipeline just saved me 2 hours of manual deployment work. Automation is the way. Never going back to manual deployments.",
  "Debugging a race condition in production. Turns out idempotent operations would have prevented this entire class of bugs from the start.",
  "Just implemented circuit breaker pattern in our microservices. Graceful degradation is beautiful when it works. Testing it was another story.",
  "Monitoring is not optional. You can't fix what you can't see. Added 50 new metrics today and already found two potential issues.",
  "Code review tip: Look for non-idempotent operations in your critical paths. They're the source of so many production incidents.",
  "Kubernetes rolling update in progress. Zero downtime, zero stress. This is what good infrastructure feels like.",
  "Just wrote a terraform module that provisions entire environments. Click a button, get a staging environment in 10 minutes.",
  "Observability trifecta: logs, metrics, traces. Finally got all three working together. The debugging experience is night and day.",
  "Chaos engineering exercise today: randomly killed pods in production. System self-healed beautifully. Confidence level: high.",
  "API versioning strategy locked in. Breaking changes isolated to v2 endpoint. Existing clients keep working. Everyone's happy.",
  "Implemented rate limiting on our API. 1000 requests per minute per user. Abuse protection without impacting legitimate users.",
  "Load testing results are in: 10,000 concurrent users, p99 latency under 200ms. Ready for the product launch tomorrow!",
  "Security audit complete. Found 3 medium issues, all fixed within 24 hours. Clean bill of health for production.",
  "Database replication lag down to 50ms. Real-time analytics now possible. The data team is thrilled with the improvement.",
  "Container image size reduced from 2GB to 200MB. Build times cut in half. Sometimes smaller really is better.",
  "Implemented GitOps workflow. Every change goes through PR, gets reviewed, and auto-deploys on merge. Beautiful.",
  "On-call shift complete. Zero pages! Either everything is working great, or our alerting is broken. Hoping it's the former.",
];

const LONG_CONTENTS = [
  "Just finished designing a new microservices architecture. The key? Keep services small, focused, and independently deployable. Idempotency at every boundary makes everything more resilient. Teams can deploy without coordination!",
  "Good morning! Starting the day with some Kubernetes debugging. Who else loves a good CrashLoopBackOff investigation? Just kidding, nobody does. But we persist! The joy is in the solution, not the problem.",
  "Hot take: The best incident response is preventing incidents in the first place. Invest in testing, monitoring, and chaos engineering. Your future self (and your users) will thank you when the next failure doesn't cascade.",
  "Reflecting on 5 years of DevOps experience: The tools change constantly, but the principles remain. Automation, measurement, sharing, and continuous improvement. Master those, and you'll adapt to any technology shift.",
  "Just completed our annual disaster recovery drill. Full datacenter failover in under 15 minutes. All data intact, all services recovered. This is why we practice. Confidence comes from preparation, not luck.",
  "Unpopular opinion: Most companies don't need microservices. A well-structured monolith with good deployment practices will serve you better. Microservices add complexity that many teams aren't ready to manage effectively.",
  "The secret to reliable systems isn't avoiding failures - it's designing for them. Redundancy, circuit breakers, graceful degradation, and idempotent operations. Build assuming everything will fail, and nothing will surprise you.",
  "Feature flags have changed how we deploy. Ship code to production constantly, but reveal features gradually. If something goes wrong, flip a switch instead of rolling back. Deployment becomes a non-event. Release becomes controllable.",
  "Spent the week optimizing our CI pipeline. Build time: 45 minutes down to 8 minutes. Developer productivity improvement is massive. Fast feedback loops are worth the investment. Your team will thank you for prioritizing this.",
  "Database migrations are scary because they're often irreversible. Solution: Make them reversible! Every migration should have a rollback. Every data change should be recoverable. Sleep better knowing you can undo your mistakes.",
];

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function generateDemoIdems(count: number = 200, seed: number = 42): Idem[] {
  const random = seededRandom(seed);
  const idems: Idem[] = [];
  const baseDate = new Date("2025-12-19T14:30:00Z");

  for (let i = 0; i < count; i++) {
    const authorIndex = Math.floor(random() * AUTHORS.length);
    const contentRoll = random();

    let content: string;
    if (contentRoll < 0.3) {
      content = SHORT_CONTENTS[Math.floor(random() * SHORT_CONTENTS.length)];
    } else if (contentRoll < 0.8) {
      content = MEDIUM_CONTENTS[Math.floor(random() * MEDIUM_CONTENTS.length)];
    } else {
      content = LONG_CONTENTS[Math.floor(random() * LONG_CONTENTS.length)];
    }

    const hoursAgo = Math.floor(random() * 168);
    const createdAt = new Date(baseDate.getTime() - hoursAgo * 3600000);

    idems.push({
      id: `idem-${String(count - i).padStart(3, "0")}`,
      author: AUTHORS[authorIndex],
      content,
      createdAt: createdAt.toISOString(),
      isSeeded: true,
    });
  }

  return idems.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Database operations
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS idems (
  id VARCHAR(20) PRIMARY KEY,
  author VARCHAR(50) NOT NULL,
  content VARCHAR(280) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_seeded BOOLEAN NOT NULL DEFAULT false
);
`;

const ADD_IS_SEEDED_COLUMN_SQL = `
ALTER TABLE idems ADD COLUMN IF NOT EXISTS is_seeded BOOLEAN NOT NULL DEFAULT false;
`;

const CREATE_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS idx_idems_created_at ON idems(created_at DESC);
`;

async function seed() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('Connecting to database...');

    // Create table if not exists
    console.log('Creating table schema...');
    await pool.query(CREATE_TABLE_SQL);
    await pool.query(ADD_IS_SEEDED_COLUMN_SQL);
    await pool.query(CREATE_INDEX_SQL);

    // Truncate existing data
    console.log('Clearing existing data...');
    await pool.query('TRUNCATE TABLE idems');

    // Generate demo data
    console.log('Generating demo data...');
    const idems = generateDemoIdems(200);

    // Batch insert using multi-row VALUES
    console.log(`Inserting ${idems.length} idems...`);

    const BATCH_SIZE = 50;
    for (let i = 0; i < idems.length; i += BATCH_SIZE) {
      const batch = idems.slice(i, i + BATCH_SIZE);
      const values: unknown[] = [];
      const placeholders: string[] = [];

      batch.forEach((idem, index) => {
        const offset = index * 5;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
        values.push(idem.id, idem.author, idem.content, idem.createdAt, idem.isSeeded);
      });

      await pool.query(
        `INSERT INTO idems (id, author, content, created_at, is_seeded) VALUES ${placeholders.join(', ')}`,
        values
      );
    }

    // Verify
    const result = await pool.query('SELECT COUNT(*) as count FROM idems');
    console.log(`Seed complete! Inserted ${result.rows[0].count} idems.`);

  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
