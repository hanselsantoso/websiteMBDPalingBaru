import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branding" ALTER COLUMN "mascot_name" SET DEFAULT 'Pivot';
  ALTER TABLE "branding" ALTER COLUMN "mascot_nickname" SET DEFAULT 'Pivot';
  ALTER TABLE "_branding_v" ALTER COLUMN "version_mascot_name" SET DEFAULT 'Pivot';
  ALTER TABLE "_branding_v" ALTER COLUMN "version_mascot_nickname" SET DEFAULT 'Pivot';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branding" ALTER COLUMN "mascot_name" SET DEFAULT 'Siasat';
  ALTER TABLE "branding" ALTER COLUMN "mascot_nickname" SET DEFAULT 'Sia';
  ALTER TABLE "_branding_v" ALTER COLUMN "version_mascot_name" SET DEFAULT 'Siasat';
  ALTER TABLE "_branding_v" ALTER COLUMN "version_mascot_nickname" SET DEFAULT 'Sia';`)
}
