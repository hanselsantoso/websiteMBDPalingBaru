import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "content_translations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "source" varchar NOT NULL,
    "english" varchar NOT NULL,
    "source_key" varchar DEFAULT '' NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "content_translations_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" uuid NOT NULL,
    "path" varchar NOT NULL,
    "admins_id" uuid,
    "mcp_content_accounts_id" uuid
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "content_translations_id" uuid;
  ALTER TABLE "content_translations_rels" ADD CONSTRAINT "content_translations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content_translations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_translations_rels" ADD CONSTRAINT "content_translations_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_translations_rels" ADD CONSTRAINT "content_translations_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "content_translations_source_key_idx" ON "content_translations" USING btree ("source_key");
  CREATE INDEX "content_translations_updated_at_idx" ON "content_translations" USING btree ("updated_at");
  CREATE INDEX "content_translations_created_at_idx" ON "content_translations" USING btree ("created_at");
  CREATE INDEX "content_translations_rels_order_idx" ON "content_translations_rels" USING btree ("order");
  CREATE INDEX "content_translations_rels_parent_idx" ON "content_translations_rels" USING btree ("parent_id");
  CREATE INDEX "content_translations_rels_path_idx" ON "content_translations_rels" USING btree ("path");
  CREATE INDEX "content_translations_rels_admins_id_idx" ON "content_translations_rels" USING btree ("admins_id");
  CREATE INDEX "content_translations_rels_mcp_content_accounts_id_idx" ON "content_translations_rels" USING btree ("mcp_content_accounts_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_translations_fk" FOREIGN KEY ("content_translations_id") REFERENCES "public"."content_translations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_content_translations_id_idx" ON "payload_locked_documents_rels" USING btree ("content_translations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "content_translations_id";
  DROP TABLE "content_translations_rels";
  DROP TABLE "content_translations";`)
}
