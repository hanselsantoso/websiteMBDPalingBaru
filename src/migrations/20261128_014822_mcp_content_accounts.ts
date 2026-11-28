import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_mcp_content_accounts_mode" AS ENUM('reader', 'editor');
  CREATE TABLE "mcp_content_accounts" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar NOT NULL,
    "mode" "enum_mcp_content_accounts_mode" DEFAULT 'reader' NOT NULL,
    "active" boolean DEFAULT true,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "api_key" varchar,
    "api_key_last4" varchar,
    "api_key_index" varchar
  );

  CREATE TABLE "mcp_content_accounts_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" uuid NOT NULL,
    "path" varchar NOT NULL,
    "admins_id" uuid,
    "mcp_content_accounts_id" uuid
  );

  ALTER TABLE "pages_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "posts_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "post_categories_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_post_categories_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "post_tags_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_post_tags_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "media_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_media_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "folders_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_folders_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "tags_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_tags_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "testimonials_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_testimonials_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "career_paths_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_career_paths_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "partners_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_partners_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "programs_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_programs_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "job_posts_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_job_posts_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "faqs_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_faqs_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "curriculum_versions_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_curriculum_versions_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "courses_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_courses_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "faculty_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_faculty_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "pmb_applications_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_pmb_applications_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "leads_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_leads_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "contact_messages_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_contact_messages_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "pmb_waves_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_pmb_waves_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "pmb_tracks_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_pmb_tracks_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "message_templates_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_message_templates_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "pmb_documents_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_pmb_documents_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "quiz_questions_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_quiz_questions_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "quiz_results_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_quiz_results_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "quiz_attempts_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_quiz_attempts_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "admins_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "roles_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_roles_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "redirects_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_redirects_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "not_found_logs_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_not_found_logs_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "audit_logs_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_audit_logs_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "analytics_events_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_analytics_events_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "payload_llm_instructions_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "site_settings_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_site_settings_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "branding_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_branding_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "navigation_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_navigation_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "pmb_settings_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "_pmb_settings_v_rels" ADD COLUMN "mcp_content_accounts_id" uuid;
  ALTER TABLE "mcp_content_accounts_rels" ADD CONSTRAINT "mcp_content_accounts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mcp_content_accounts_rels" ADD CONSTRAINT "mcp_content_accounts_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mcp_content_accounts_rels" ADD CONSTRAINT "mcp_content_accounts_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "mcp_content_accounts_updated_at_idx" ON "mcp_content_accounts" USING btree ("updated_at");
  CREATE INDEX "mcp_content_accounts_created_at_idx" ON "mcp_content_accounts" USING btree ("created_at");
  CREATE INDEX "mcp_content_accounts_rels_order_idx" ON "mcp_content_accounts_rels" USING btree ("order");
  CREATE INDEX "mcp_content_accounts_rels_parent_idx" ON "mcp_content_accounts_rels" USING btree ("parent_id");
  CREATE INDEX "mcp_content_accounts_rels_path_idx" ON "mcp_content_accounts_rels" USING btree ("path");
  CREATE INDEX "mcp_content_accounts_rels_admins_id_idx" ON "mcp_content_accounts_rels" USING btree ("admins_id");
  CREATE INDEX "mcp_content_accounts_rels_mcp_content_accounts_id_idx" ON "mcp_content_accounts_rels" USING btree ("mcp_content_accounts_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_post_categories_v_rels" ADD CONSTRAINT "_post_categories_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_tags_rels" ADD CONSTRAINT "post_tags_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_post_tags_v_rels" ADD CONSTRAINT "_post_tags_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_paths_rels" ADD CONSTRAINT "career_paths_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_paths_v_rels" ADD CONSTRAINT "_career_paths_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_rels" ADD CONSTRAINT "_partners_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_posts_rels" ADD CONSTRAINT "job_posts_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_posts_v_rels" ADD CONSTRAINT "_job_posts_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_rels" ADD CONSTRAINT "_faqs_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "curriculum_versions_rels" ADD CONSTRAINT "curriculum_versions_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_curriculum_versions_v_rels" ADD CONSTRAINT "_curriculum_versions_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_rels" ADD CONSTRAINT "faculty_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v_rels" ADD CONSTRAINT "_faculty_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_applications_rels" ADD CONSTRAINT "pmb_applications_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_rels" ADD CONSTRAINT "_pmb_applications_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v_rels" ADD CONSTRAINT "_leads_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages_rels" ADD CONSTRAINT "contact_messages_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_messages_v_rels" ADD CONSTRAINT "_contact_messages_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_waves_rels" ADD CONSTRAINT "pmb_waves_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_waves_v_rels" ADD CONSTRAINT "_pmb_waves_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_tracks_rels" ADD CONSTRAINT "pmb_tracks_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_tracks_v_rels" ADD CONSTRAINT "_pmb_tracks_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "message_templates_rels" ADD CONSTRAINT "message_templates_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_message_templates_v_rels" ADD CONSTRAINT "_message_templates_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_documents_rels" ADD CONSTRAINT "pmb_documents_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_documents_v_rels" ADD CONSTRAINT "_pmb_documents_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_questions_rels" ADD CONSTRAINT "quiz_questions_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_questions_v_rels" ADD CONSTRAINT "_quiz_questions_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_results_rels" ADD CONSTRAINT "quiz_results_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_results_v_rels" ADD CONSTRAINT "_quiz_results_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_attempts_rels" ADD CONSTRAINT "quiz_attempts_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_attempts_v_rels" ADD CONSTRAINT "_quiz_attempts_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roles_rels" ADD CONSTRAINT "roles_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roles_v_rels" ADD CONSTRAINT "_roles_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "not_found_logs_rels" ADD CONSTRAINT "not_found_logs_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_not_found_logs_v_rels" ADD CONSTRAINT "_not_found_logs_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs_rels" ADD CONSTRAINT "audit_logs_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_audit_logs_v_rels" ADD CONSTRAINT "_audit_logs_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "analytics_events_rels" ADD CONSTRAINT "analytics_events_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_analytics_events_v_rels" ADD CONSTRAINT "_analytics_events_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branding_rels" ADD CONSTRAINT "branding_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_branding_v_rels" ADD CONSTRAINT "_branding_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_rels" ADD CONSTRAINT "pmb_settings_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_rels" ADD CONSTRAINT "_pmb_settings_v_rels_mcp_content_accounts_fk" FOREIGN KEY ("mcp_content_accounts_id") REFERENCES "public"."mcp_content_accounts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_mcp_content_accounts_id_idx" ON "pages_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_pages_v_rels_mcp_content_accounts_id_idx" ON "_pages_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "posts_rels_mcp_content_accounts_id_idx" ON "posts_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_posts_v_rels_mcp_content_accounts_id_idx" ON "_posts_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "post_categories_rels_mcp_content_accounts_id_idx" ON "post_categories_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_post_categories_v_rels_mcp_content_accounts_id_idx" ON "_post_categories_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "post_tags_rels_mcp_content_accounts_id_idx" ON "post_tags_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_post_tags_v_rels_mcp_content_accounts_id_idx" ON "_post_tags_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "media_rels_mcp_content_accounts_id_idx" ON "media_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_media_v_rels_mcp_content_accounts_id_idx" ON "_media_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "folders_rels_mcp_content_accounts_id_idx" ON "folders_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_folders_v_rels_mcp_content_accounts_id_idx" ON "_folders_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "tags_rels_mcp_content_accounts_id_idx" ON "tags_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_tags_v_rels_mcp_content_accounts_id_idx" ON "_tags_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "testimonials_rels_mcp_content_accounts_id_idx" ON "testimonials_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_testimonials_v_rels_mcp_content_accounts_id_idx" ON "_testimonials_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "career_paths_rels_mcp_content_accounts_id_idx" ON "career_paths_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_career_paths_v_rels_mcp_content_accounts_id_idx" ON "_career_paths_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "partners_rels_mcp_content_accounts_id_idx" ON "partners_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_partners_v_rels_mcp_content_accounts_id_idx" ON "_partners_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "programs_rels_mcp_content_accounts_id_idx" ON "programs_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_programs_v_rels_mcp_content_accounts_id_idx" ON "_programs_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "job_posts_rels_mcp_content_accounts_id_idx" ON "job_posts_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_job_posts_v_rels_mcp_content_accounts_id_idx" ON "_job_posts_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "faqs_rels_mcp_content_accounts_id_idx" ON "faqs_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_faqs_v_rels_mcp_content_accounts_id_idx" ON "_faqs_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "curriculum_versions_rels_mcp_content_accounts_id_idx" ON "curriculum_versions_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_curriculum_versions_v_rels_mcp_content_accounts_id_idx" ON "_curriculum_versions_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "courses_rels_mcp_content_accounts_id_idx" ON "courses_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_courses_v_rels_mcp_content_accounts_id_idx" ON "_courses_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "faculty_rels_mcp_content_accounts_id_idx" ON "faculty_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_faculty_v_rels_mcp_content_accounts_id_idx" ON "_faculty_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "pmb_applications_rels_mcp_content_accounts_id_idx" ON "pmb_applications_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_pmb_applications_v_rels_mcp_content_accounts_id_idx" ON "_pmb_applications_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "leads_rels_mcp_content_accounts_id_idx" ON "leads_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_leads_v_rels_mcp_content_accounts_id_idx" ON "_leads_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "contact_messages_rels_mcp_content_accounts_id_idx" ON "contact_messages_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_contact_messages_v_rels_mcp_content_accounts_id_idx" ON "_contact_messages_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "pmb_waves_rels_mcp_content_accounts_id_idx" ON "pmb_waves_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_pmb_waves_v_rels_mcp_content_accounts_id_idx" ON "_pmb_waves_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "pmb_tracks_rels_mcp_content_accounts_id_idx" ON "pmb_tracks_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_pmb_tracks_v_rels_mcp_content_accounts_id_idx" ON "_pmb_tracks_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "message_templates_rels_mcp_content_accounts_id_idx" ON "message_templates_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_message_templates_v_rels_mcp_content_accounts_id_idx" ON "_message_templates_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "pmb_documents_rels_mcp_content_accounts_id_idx" ON "pmb_documents_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_pmb_documents_v_rels_mcp_content_accounts_id_idx" ON "_pmb_documents_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "quiz_questions_rels_mcp_content_accounts_id_idx" ON "quiz_questions_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_quiz_questions_v_rels_mcp_content_accounts_id_idx" ON "_quiz_questions_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "quiz_results_rels_mcp_content_accounts_id_idx" ON "quiz_results_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_quiz_results_v_rels_mcp_content_accounts_id_idx" ON "_quiz_results_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "quiz_attempts_rels_mcp_content_accounts_id_idx" ON "quiz_attempts_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_quiz_attempts_v_rels_mcp_content_accounts_id_idx" ON "_quiz_attempts_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "admins_rels_mcp_content_accounts_id_idx" ON "admins_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "roles_rels_mcp_content_accounts_id_idx" ON "roles_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_roles_v_rels_mcp_content_accounts_id_idx" ON "_roles_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "redirects_rels_mcp_content_accounts_id_idx" ON "redirects_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_redirects_v_rels_mcp_content_accounts_id_idx" ON "_redirects_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "not_found_logs_rels_mcp_content_accounts_id_idx" ON "not_found_logs_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_not_found_logs_v_rels_mcp_content_accounts_id_idx" ON "_not_found_logs_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "audit_logs_rels_mcp_content_accounts_id_idx" ON "audit_logs_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_audit_logs_v_rels_mcp_content_accounts_id_idx" ON "_audit_logs_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "analytics_events_rels_mcp_content_accounts_id_idx" ON "analytics_events_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_analytics_events_v_rels_mcp_content_accounts_id_idx" ON "_analytics_events_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "payload_locked_documents_rels_mcp_content_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "payload_preferences_rels_mcp_content_accounts_id_idx" ON "payload_preferences_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "payload_llm_instructions_rels_mcp_content_accounts_id_idx" ON "payload_llm_instructions_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "site_settings_rels_mcp_content_accounts_id_idx" ON "site_settings_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_site_settings_v_rels_mcp_content_accounts_id_idx" ON "_site_settings_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "branding_rels_mcp_content_accounts_id_idx" ON "branding_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_branding_v_rels_mcp_content_accounts_id_idx" ON "_branding_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "navigation_rels_mcp_content_accounts_id_idx" ON "navigation_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_navigation_v_rels_mcp_content_accounts_id_idx" ON "_navigation_v_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "pmb_settings_rels_mcp_content_accounts_id_idx" ON "pmb_settings_rels" USING btree ("mcp_content_accounts_id");
  CREATE INDEX "_pmb_settings_v_rels_mcp_content_accounts_id_idx" ON "_pmb_settings_v_rels" USING btree ("mcp_content_accounts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "mcp_content_accounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mcp_content_accounts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_mcp_content_accounts_fk";

  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_mcp_content_accounts_fk";

  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "post_categories_rels" DROP CONSTRAINT "post_categories_rels_mcp_content_accounts_fk";

  ALTER TABLE "_post_categories_v_rels" DROP CONSTRAINT "_post_categories_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "post_tags_rels" DROP CONSTRAINT "post_tags_rels_mcp_content_accounts_fk";

  ALTER TABLE "_post_tags_v_rels" DROP CONSTRAINT "_post_tags_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "media_rels" DROP CONSTRAINT "media_rels_mcp_content_accounts_fk";

  ALTER TABLE "_media_v_rels" DROP CONSTRAINT "_media_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "folders_rels" DROP CONSTRAINT "folders_rels_mcp_content_accounts_fk";

  ALTER TABLE "_folders_v_rels" DROP CONSTRAINT "_folders_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "tags_rels" DROP CONSTRAINT "tags_rels_mcp_content_accounts_fk";

  ALTER TABLE "_tags_v_rels" DROP CONSTRAINT "_tags_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "testimonials_rels" DROP CONSTRAINT "testimonials_rels_mcp_content_accounts_fk";

  ALTER TABLE "_testimonials_v_rels" DROP CONSTRAINT "_testimonials_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "career_paths_rels" DROP CONSTRAINT "career_paths_rels_mcp_content_accounts_fk";

  ALTER TABLE "_career_paths_v_rels" DROP CONSTRAINT "_career_paths_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "partners_rels" DROP CONSTRAINT "partners_rels_mcp_content_accounts_fk";

  ALTER TABLE "_partners_v_rels" DROP CONSTRAINT "_partners_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "programs_rels" DROP CONSTRAINT "programs_rels_mcp_content_accounts_fk";

  ALTER TABLE "_programs_v_rels" DROP CONSTRAINT "_programs_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "job_posts_rels" DROP CONSTRAINT "job_posts_rels_mcp_content_accounts_fk";

  ALTER TABLE "_job_posts_v_rels" DROP CONSTRAINT "_job_posts_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "faqs_rels" DROP CONSTRAINT "faqs_rels_mcp_content_accounts_fk";

  ALTER TABLE "_faqs_v_rels" DROP CONSTRAINT "_faqs_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "curriculum_versions_rels" DROP CONSTRAINT "curriculum_versions_rels_mcp_content_accounts_fk";

  ALTER TABLE "_curriculum_versions_v_rels" DROP CONSTRAINT "_curriculum_versions_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "courses_rels" DROP CONSTRAINT "courses_rels_mcp_content_accounts_fk";

  ALTER TABLE "_courses_v_rels" DROP CONSTRAINT "_courses_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "faculty_rels" DROP CONSTRAINT "faculty_rels_mcp_content_accounts_fk";

  ALTER TABLE "_faculty_v_rels" DROP CONSTRAINT "_faculty_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "pmb_applications_rels" DROP CONSTRAINT "pmb_applications_rels_mcp_content_accounts_fk";

  ALTER TABLE "_pmb_applications_v_rels" DROP CONSTRAINT "_pmb_applications_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "leads_rels" DROP CONSTRAINT "leads_rels_mcp_content_accounts_fk";

  ALTER TABLE "_leads_v_rels" DROP CONSTRAINT "_leads_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "contact_messages_rels" DROP CONSTRAINT "contact_messages_rels_mcp_content_accounts_fk";

  ALTER TABLE "_contact_messages_v_rels" DROP CONSTRAINT "_contact_messages_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "pmb_waves_rels" DROP CONSTRAINT "pmb_waves_rels_mcp_content_accounts_fk";

  ALTER TABLE "_pmb_waves_v_rels" DROP CONSTRAINT "_pmb_waves_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "pmb_tracks_rels" DROP CONSTRAINT "pmb_tracks_rels_mcp_content_accounts_fk";

  ALTER TABLE "_pmb_tracks_v_rels" DROP CONSTRAINT "_pmb_tracks_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "message_templates_rels" DROP CONSTRAINT "message_templates_rels_mcp_content_accounts_fk";

  ALTER TABLE "_message_templates_v_rels" DROP CONSTRAINT "_message_templates_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "pmb_documents_rels" DROP CONSTRAINT "pmb_documents_rels_mcp_content_accounts_fk";

  ALTER TABLE "_pmb_documents_v_rels" DROP CONSTRAINT "_pmb_documents_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "quiz_questions_rels" DROP CONSTRAINT "quiz_questions_rels_mcp_content_accounts_fk";

  ALTER TABLE "_quiz_questions_v_rels" DROP CONSTRAINT "_quiz_questions_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "quiz_results_rels" DROP CONSTRAINT "quiz_results_rels_mcp_content_accounts_fk";

  ALTER TABLE "_quiz_results_v_rels" DROP CONSTRAINT "_quiz_results_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "quiz_attempts_rels" DROP CONSTRAINT "quiz_attempts_rels_mcp_content_accounts_fk";

  ALTER TABLE "_quiz_attempts_v_rels" DROP CONSTRAINT "_quiz_attempts_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "admins_rels" DROP CONSTRAINT "admins_rels_mcp_content_accounts_fk";

  ALTER TABLE "roles_rels" DROP CONSTRAINT "roles_rels_mcp_content_accounts_fk";

  ALTER TABLE "_roles_v_rels" DROP CONSTRAINT "_roles_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_mcp_content_accounts_fk";

  ALTER TABLE "_redirects_v_rels" DROP CONSTRAINT "_redirects_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "not_found_logs_rels" DROP CONSTRAINT "not_found_logs_rels_mcp_content_accounts_fk";

  ALTER TABLE "_not_found_logs_v_rels" DROP CONSTRAINT "_not_found_logs_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "audit_logs_rels" DROP CONSTRAINT "audit_logs_rels_mcp_content_accounts_fk";

  ALTER TABLE "_audit_logs_v_rels" DROP CONSTRAINT "_audit_logs_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "analytics_events_rels" DROP CONSTRAINT "analytics_events_rels_mcp_content_accounts_fk";

  ALTER TABLE "_analytics_events_v_rels" DROP CONSTRAINT "_analytics_events_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_mcp_content_accounts_fk";

  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_mcp_content_accounts_fk";

  ALTER TABLE "payload_llm_instructions_rels" DROP CONSTRAINT "payload_llm_instructions_rels_mcp_content_accounts_fk";

  ALTER TABLE "site_settings_rels" DROP CONSTRAINT "site_settings_rels_mcp_content_accounts_fk";

  ALTER TABLE "_site_settings_v_rels" DROP CONSTRAINT "_site_settings_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "branding_rels" DROP CONSTRAINT "branding_rels_mcp_content_accounts_fk";

  ALTER TABLE "_branding_v_rels" DROP CONSTRAINT "_branding_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "navigation_rels" DROP CONSTRAINT "navigation_rels_mcp_content_accounts_fk";

  ALTER TABLE "_navigation_v_rels" DROP CONSTRAINT "_navigation_v_rels_mcp_content_accounts_fk";

  ALTER TABLE "pmb_settings_rels" DROP CONSTRAINT "pmb_settings_rels_mcp_content_accounts_fk";

  ALTER TABLE "_pmb_settings_v_rels" DROP CONSTRAINT "_pmb_settings_v_rels_mcp_content_accounts_fk";

  DROP INDEX "pages_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_pages_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "posts_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_posts_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "post_categories_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_post_categories_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "post_tags_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_post_tags_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "media_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_media_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "folders_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_folders_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "tags_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_tags_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "testimonials_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_testimonials_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "career_paths_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_career_paths_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "partners_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_partners_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "programs_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_programs_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "job_posts_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_job_posts_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "faqs_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_faqs_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "curriculum_versions_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_curriculum_versions_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "courses_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_courses_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "faculty_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_faculty_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "pmb_applications_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_pmb_applications_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "leads_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_leads_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "contact_messages_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_contact_messages_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "pmb_waves_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_pmb_waves_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "pmb_tracks_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_pmb_tracks_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "message_templates_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_message_templates_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "pmb_documents_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_pmb_documents_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "quiz_questions_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_quiz_questions_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "quiz_results_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_quiz_results_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "quiz_attempts_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_quiz_attempts_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "admins_rels_mcp_content_accounts_id_idx";
  DROP INDEX "roles_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_roles_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "redirects_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_redirects_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "not_found_logs_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_not_found_logs_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "audit_logs_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_audit_logs_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "analytics_events_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_analytics_events_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "payload_locked_documents_rels_mcp_content_accounts_id_idx";
  DROP INDEX "payload_preferences_rels_mcp_content_accounts_id_idx";
  DROP INDEX "payload_llm_instructions_rels_mcp_content_accounts_id_idx";
  DROP INDEX "site_settings_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_site_settings_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "branding_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_branding_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "navigation_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_navigation_v_rels_mcp_content_accounts_id_idx";
  DROP INDEX "pmb_settings_rels_mcp_content_accounts_id_idx";
  DROP INDEX "_pmb_settings_v_rels_mcp_content_accounts_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "posts_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "post_categories_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_post_categories_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "post_tags_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_post_tags_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "media_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_media_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "folders_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_folders_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "tags_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_tags_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "testimonials_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_testimonials_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "career_paths_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_career_paths_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "partners_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_partners_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "programs_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_programs_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "job_posts_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_job_posts_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "faqs_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_faqs_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "curriculum_versions_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_curriculum_versions_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "courses_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_courses_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "faculty_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_faculty_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "pmb_applications_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_pmb_applications_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "leads_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_leads_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "contact_messages_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_contact_messages_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "pmb_waves_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_pmb_waves_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "pmb_tracks_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_pmb_tracks_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "message_templates_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_message_templates_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "pmb_documents_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_pmb_documents_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "quiz_questions_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_quiz_questions_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "quiz_results_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_quiz_results_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "quiz_attempts_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_quiz_attempts_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "admins_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "roles_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_roles_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_redirects_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "not_found_logs_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_not_found_logs_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "audit_logs_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_audit_logs_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "analytics_events_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_analytics_events_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "payload_llm_instructions_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "site_settings_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_site_settings_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "branding_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_branding_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "navigation_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_navigation_v_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "pmb_settings_rels" DROP COLUMN "mcp_content_accounts_id";
  ALTER TABLE "_pmb_settings_v_rels" DROP COLUMN "mcp_content_accounts_id";
  DROP TABLE "mcp_content_accounts" CASCADE;
  DROP TABLE "mcp_content_accounts_rels" CASCADE;
  DROP TYPE "public"."enum_mcp_content_accounts_mode";`)
}
