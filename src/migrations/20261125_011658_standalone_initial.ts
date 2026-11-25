import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en');
  CREATE TYPE "public"."enum_pages_blocks_hero_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_pages_blocks_page_header_actions_kind" AS ENUM('link', 'primaryCta', 'whatsapp', 'quiz', 'brochure', 'curriculumPdf');
  CREATE TYPE "public"."enum_pages_blocks_page_header_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_pages_blocks_stats_items_source" AS ENUM('manual', 'totalCourses', 'totalCredits');
  CREATE TYPE "public"."enum_pages_blocks_why_mbd_cards_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum_pages_blocks_why_mbd_cards_size" AS ENUM('normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_variant" AS ENUM('full', 'strip');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_image_text_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_blocks_faq_scope" AS ENUM('umum', 'pmb', 'kontak', 'kurikulum', 'kuis');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_cards_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_style" AS ENUM('sticker', 'numbered', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_pages_blocks_marquee_source" AS ENUM('words', 'partners');
  CREATE TYPE "public"."enum_pages_blocks_marquee_tone" AS ENUM('navy', 'blue', 'light');
  CREATE TYPE "public"."enum_pages_blocks_form_embed_form" AS ENUM('kontak', 'konsultasi', 'brosur', 'pmb', 'statusPmb');
  CREATE TYPE "public"."enum_pages_blocks_form_embed_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_pages_blocks_pmb_info_section" AS ENUM('tracks', 'waves', 'requirements', 'fees', 'stepper');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('standar', 'legal');
  CREATE TYPE "public"."enum_pages_review_status" AS ENUM('none', 'review', 'archived');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__pages_v_blocks_page_header_actions_kind" AS ENUM('link', 'primaryCta', 'whatsapp', 'quiz', 'brochure', 'curriculumPdf');
  CREATE TYPE "public"."enum__pages_v_blocks_page_header_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_items_source" AS ENUM('manual', 'totalCourses', 'totalCredits');
  CREATE TYPE "public"."enum__pages_v_blocks_why_mbd_cards_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum__pages_v_blocks_why_mbd_cards_size" AS ENUM('normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_variant" AS ENUM('full', 'strip');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_scope" AS ENUM('umum', 'pmb', 'kontak', 'kurikulum', 'kuis');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_cards_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_style" AS ENUM('sticker', 'numbered', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_source" AS ENUM('words', 'partners');
  CREATE TYPE "public"."enum__pages_v_blocks_marquee_tone" AS ENUM('navy', 'blue', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_form_embed_form" AS ENUM('kontak', 'konsultasi', 'brosur', 'pmb', 'statusPmb');
  CREATE TYPE "public"."enum__pages_v_blocks_form_embed_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__pages_v_blocks_pmb_info_section" AS ENUM('tracks', 'waves', 'requirements', 'fees', 'stepper');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('standar', 'legal');
  CREATE TYPE "public"."enum__pages_v_version_review_status" AS ENUM('none', 'review', 'archived');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_review_status" AS ENUM('none', 'review', 'archived');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_review_status" AS ENUM('none', 'review', 'archived');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_career_paths_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum__career_paths_v_version_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum_partners_kind" AS ENUM('mitra', 'akreditasi');
  CREATE TYPE "public"."enum__partners_v_version_kind" AS ENUM('mitra', 'akreditasi');
  CREATE TYPE "public"."enum_programs_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_programs_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum__programs_v_version_mascot_pose" AS ENUM('none', 'greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__programs_v_version_icon" AS ENUM('ai', 'data', 'bisnis', 'ecommerce', 'fintech', 'teknologi', 'kreatif', 'kampus', 'capstone', 'enrichment', 'beasiswa', 'komunitas', 'industri', 'target', 'roket', 'bintang');
  CREATE TYPE "public"."enum_job_posts_type" AS ENUM('magang', 'penuh-waktu', 'paruh-waktu', 'kontrak', 'freelance');
  CREATE TYPE "public"."enum__job_posts_v_version_type" AS ENUM('magang', 'penuh-waktu', 'paruh-waktu', 'kontrak', 'freelance');
  CREATE TYPE "public"."enum_faqs_scope" AS ENUM('umum', 'pmb', 'kontak', 'kurikulum', 'kuis');
  CREATE TYPE "public"."enum__faqs_v_version_scope" AS ENUM('umum', 'pmb', 'kontak', 'kurikulum', 'kuis');
  CREATE TYPE "public"."enum_curriculum_versions_status" AS ENUM('draft', 'aktif', 'arsip');
  CREATE TYPE "public"."enum__curriculum_versions_v_version_status" AS ENUM('draft', 'aktif', 'arsip');
  CREATE TYPE "public"."enum_courses_tags" AS ENUM('AI', 'Data', 'Bisnis', 'E-Commerce', 'Fintech', 'Teknologi', 'Kreatif', 'Umum', 'Enrichment', 'Capstone');
  CREATE TYPE "public"."enum_courses_type" AS ENUM('wajib', 'pilihan', 'umum');
  CREATE TYPE "public"."enum__courses_v_version_tags" AS ENUM('AI', 'Data', 'Bisnis', 'E-Commerce', 'Fintech', 'Teknologi', 'Kreatif', 'Umum', 'Enrichment', 'Capstone');
  CREATE TYPE "public"."enum__courses_v_version_type" AS ENUM('wajib', 'pilihan', 'umum');
  CREATE TYPE "public"."enum_faculty_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faculty_v_published_locale" AS ENUM('en');
  CREATE TYPE "public"."enum__faculty_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pmb_applications_status_history_from_status" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum_pmb_applications_status_history_to_status" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum_pmb_applications_status" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum__pmb_applications_v_version_status_history_from_status" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum__pmb_applications_v_version_status_history_to_status" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum__pmb_applications_v_version_status" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum_leads_sources" AS ENUM('brosur', 'kuis', 'kontak', 'whatsapp', 'pmb', 'konsultasi', 'event');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('baru', 'dihubungi', 'tertarik', 'pre-registrasi', 'daftar', 'tidak-tertarik');
  CREATE TYPE "public"."enum_leads_first_source" AS ENUM('brosur', 'kuis', 'kontak', 'whatsapp', 'pmb', 'konsultasi', 'event');
  CREATE TYPE "public"."enum__leads_v_version_sources" AS ENUM('brosur', 'kuis', 'kontak', 'whatsapp', 'pmb', 'konsultasi', 'event');
  CREATE TYPE "public"."enum__leads_v_version_status" AS ENUM('baru', 'dihubungi', 'tertarik', 'pre-registrasi', 'daftar', 'tidak-tertarik');
  CREATE TYPE "public"."enum__leads_v_version_first_source" AS ENUM('brosur', 'kuis', 'kontak', 'whatsapp', 'pmb', 'konsultasi', 'event');
  CREATE TYPE "public"."enum_contact_messages_kind" AS ENUM('pesan', 'konsultasi');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('baru', 'dibaca', 'dibalas', 'arsip');
  CREATE TYPE "public"."enum_contact_messages_topic" AS ENUM('info-pmb', 'kurikulum', 'beasiswa', 'kerja-sama', 'lainnya');
  CREATE TYPE "public"."enum_contact_messages_time_slot" AS ENUM('pagi', 'siang', 'sore');
  CREATE TYPE "public"."enum__contact_messages_v_version_kind" AS ENUM('pesan', 'konsultasi');
  CREATE TYPE "public"."enum__contact_messages_v_version_status" AS ENUM('baru', 'dibaca', 'dibalas', 'arsip');
  CREATE TYPE "public"."enum__contact_messages_v_version_topic" AS ENUM('info-pmb', 'kurikulum', 'beasiswa', 'kerja-sama', 'lainnya');
  CREATE TYPE "public"."enum__contact_messages_v_version_time_slot" AS ENUM('pagi', 'siang', 'sore');
  CREATE TYPE "public"."enum_pmb_waves_status" AS ENUM('akan-datang', 'dibuka', 'ditutup');
  CREATE TYPE "public"."enum__pmb_waves_v_version_status" AS ENUM('akan-datang', 'dibuka', 'ditutup');
  CREATE TYPE "public"."enum_message_templates_channel" AS ENUM('email', 'whatsapp');
  CREATE TYPE "public"."enum_message_templates_status_key" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum__message_templates_v_version_channel" AS ENUM('email', 'whatsapp');
  CREATE TYPE "public"."enum__message_templates_v_version_status_key" AS ENUM('baru', 'terverifikasi', 'seleksi', 'lulus', 'daftar-ulang', 'tidak-lanjut');
  CREATE TYPE "public"."enum_pmb_documents_type" AS ENUM('rapor', 'ijazah', 'identitas', 'foto', 'prestasi', 'lainnya');
  CREATE TYPE "public"."enum__pmb_documents_v_version_type" AS ENUM('rapor', 'ijazah', 'identitas', 'foto', 'prestasi', 'lainnya');
  CREATE TYPE "public"."enum_quiz_results_semesters" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8');
  CREATE TYPE "public"."enum_quiz_results_pair_key" AS ENUM('bisnis-data', 'bisnis-teknologi', 'bisnis-kreatif', 'data-teknologi', 'data-kreatif', 'teknologi-kreatif');
  CREATE TYPE "public"."enum_quiz_results_pose" AS ENUM('greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__quiz_results_v_version_semesters" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8');
  CREATE TYPE "public"."enum__quiz_results_v_version_pair_key" AS ENUM('bisnis-data', 'bisnis-teknologi', 'bisnis-kreatif', 'data-teknologi', 'data-kreatif', 'teknologi-kreatif');
  CREATE TYPE "public"."enum__quiz_results_v_version_pose" AS ENUM('greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_admins_status" AS ENUM('aktif', 'nonaktif');
  CREATE TYPE "public"."enum_redirects_status_code" AS ENUM('301', '302');
  CREATE TYPE "public"."enum__redirects_v_version_status_code" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'publish', 'unpublish', 'login');
  CREATE TYPE "public"."enum__audit_logs_v_version_action" AS ENUM('create', 'update', 'delete', 'publish', 'unpublish', 'login');
  CREATE TYPE "public"."enum_analytics_events_name" AS ENUM('session_start', 'cta_register_click', 'cta_whatsapp_click', 'brochure_download', 'quiz_start', 'quiz_complete', 'pmb_submit', 'contact_submit', 'post_view', 'not_found');
  CREATE TYPE "public"."enum__analytics_events_v_version_name" AS ENUM('session_start', 'cta_register_click', 'cta_whatsapp_click', 'brochure_download', 'quiz_start', 'quiz_complete', 'pmb_submit', 'contact_submit', 'post_view', 'not_found');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_log_parent_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_llm_instructions_entity_type" AS ENUM('collection', 'global');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('instagram', 'tiktok', 'youtube', 'linkedin', 'x', 'facebook');
  CREATE TYPE "public"."enum__site_settings_v_version_socials_platform" AS ENUM('instagram', 'tiktok', 'youtube', 'linkedin', 'x', 'facebook');
  CREATE TYPE "public"."enum_branding_lines_pose" AS ENUM('greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum__branding_v_version_lines_pose" AS ENUM('greeting', 'pointing', 'thinking', 'celebrating', 'confused', 'tablet');
  CREATE TYPE "public"."enum_navigation_header_children_link_type" AS ENUM('path', 'page', 'post', 'course', 'external', 'anchor');
  CREATE TYPE "public"."enum_navigation_header_link_type" AS ENUM('path', 'page', 'post', 'course', 'external', 'anchor');
  CREATE TYPE "public"."enum_navigation_footer_columns_links_link_type" AS ENUM('path', 'page', 'post', 'course', 'external', 'anchor');
  CREATE TYPE "public"."enum_navigation_mobile_bar_items_kind" AS ENUM('daftar', 'whatsapp', 'kuis', 'brosur');
  CREATE TYPE "public"."enum__navigation_v_version_header_children_link_type" AS ENUM('path', 'page', 'post', 'course', 'external', 'anchor');
  CREATE TYPE "public"."enum__navigation_v_version_header_link_type" AS ENUM('path', 'page', 'post', 'course', 'external', 'anchor');
  CREATE TYPE "public"."enum__navigation_v_version_footer_columns_links_link_type" AS ENUM('path', 'page', 'post', 'course', 'external', 'anchor');
  CREATE TYPE "public"."enum__navigation_v_version_mobile_bar_items_kind" AS ENUM('daftar', 'whatsapp', 'kuis', 'brosur');
  CREATE TABLE "pages_blocks_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_orbit_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar DEFAULT 'S1 MANAJEMEN BISNIS DIGITAL · ISTTS SURABAYA',
  	"headline_prefix" varchar DEFAULT 'Jadi strategis bisnis di era',
  	"subheadline" varchar,
  	"primary_label" varchar,
  	"mascot_pose" "enum_pages_blocks_hero_mascot_pose" DEFAULT 'greeting',
  	"quiz_label" varchar DEFAULT 'Cari jurusan yang cocok',
  	"whatsapp_label" varchar DEFAULT 'Chat via WhatsApp',
  	"brochure_label" varchar DEFAULT 'Unduh brosur',
  	"show_partner_strip" boolean DEFAULT true,
  	"partner_strip_label" varchar DEFAULT 'Akreditasi dan mitra',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_page_header_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum_pages_blocks_page_header_actions_kind" DEFAULT 'link',
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"intro" varchar,
  	"chip" varchar,
  	"mascot_pose" "enum_pages_blocks_page_header_mascot_pose" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"source" "enum_pages_blocks_stats_items_source" DEFAULT 'manual',
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_mbd_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"icon" "enum_pages_blocks_why_mbd_cards_icon" DEFAULT 'bintang',
  	"course_codes" varchar,
  	"size" "enum_pages_blocks_why_mbd_cards_size" DEFAULT 'normal'
  );
  
  CREATE TABLE "pages_blocks_why_mbd" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_curriculum_track" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar DEFAULT 'KURIKULUM 8 SEMESTER',
  	"heading" varchar,
  	"intro" varchar,
  	"final_card_title" varchar DEFAULT 'Lihat kurikulum lengkap',
  	"final_card_body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_curriculum_explorer" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"show_search" boolean DEFAULT true,
  	"show_path_map" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faculty_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"limit" numeric DEFAULT 4,
  	"link_label" varchar DEFAULT 'Kenal semua dosen',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faculty_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_latest_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 3,
  	"link_label" varchar DEFAULT 'Semua artikel',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"page_size" numeric DEFAULT 9,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"variant" "enum_pages_blocks_cta_band_variant" DEFAULT 'full',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mascot_pose" "enum_pages_blocks_cta_band_mascot_pose" DEFAULT 'pointing',
  	"show_secondary" boolean DEFAULT true,
  	"show_deadline" boolean DEFAULT true,
  	"deadline_label" varchar DEFAULT 'Batas akhir pendaftaran',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" uuid,
  	"mascot_pose" "enum_pages_blocks_image_text_mascot_pose" DEFAULT 'tablet',
  	"image_position" "enum_pages_blocks_image_text_image_position" DEFAULT 'right',
  	"link_label" varchar,
  	"link_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar DEFAULT 'FAQ',
  	"heading" varchar,
  	"scope" "enum_pages_blocks_faq_scope" DEFAULT 'umum',
  	"limit" numeric DEFAULT 8,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"icon" "enum_pages_blocks_card_grid_cards_icon" DEFAULT 'bintang',
  	"tag" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"columns" "enum_pages_blocks_card_grid_columns" DEFAULT '3',
  	"style" "enum_pages_blocks_card_grid_style" DEFAULT 'sticker',
  	"mascot_pose" "enum_pages_blocks_card_grid_mascot_pose" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"url" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"source" "enum_pages_blocks_marquee_source" DEFAULT 'words',
  	"tone" "enum_pages_blocks_marquee_tone" DEFAULT 'navy',
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"form" "enum_pages_blocks_form_embed_form" DEFAULT 'kontak',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mascot_pose" "enum_pages_blocks_form_embed_mascot_pose" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_career_paths" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"show_roadmap" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_job_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"empty_text" varchar DEFAULT 'Belum ada lowongan aktif. Cek lagi minggu depan, ya.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pmb_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"section" "enum_pages_blocks_pmb_info_section" DEFAULT 'tracks',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quiz_bands" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"min" numeric,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_quiz" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"intro_title" varchar DEFAULT 'Kamu cocok jadi strategis yang mana?',
  	"intro_body" varchar,
  	"disclaimer" varchar DEFAULT 'Kuis ini panduan, bukan tes seleksi masuk.',
  	"lead_capture" boolean DEFAULT true,
  	"lead_heading" varchar DEFAULT 'Mau hasil ini dikirim ke WhatsApp-mu?',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"show_map" boolean DEFAULT true,
  	"show_hours" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_not_found_hero_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_not_found_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"label" varchar DEFAULT 'RUTE TIDAK DITEMUKAN',
  	"line" varchar DEFAULT 'Waduh, halaman ini tidak ada di peta strategiku.',
  	"search_placeholder" varchar DEFAULT 'Cari mata kuliah, dosen, atau artikel',
  	"button_label" varchar DEFAULT 'Kembali ke Beranda',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean,
  	"meta_no_follow" boolean,
  	"meta_json_ld" boolean DEFAULT true,
  	"slug" varchar,
  	"is_system" boolean DEFAULT false,
  	"template" "enum_pages_template" DEFAULT 'standar',
  	"review_status" "enum_pages_review_status" DEFAULT 'none',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"_status" "enum_pages_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_pages_v_blocks_hero_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"word" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_orbit_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar DEFAULT 'S1 MANAJEMEN BISNIS DIGITAL · ISTTS SURABAYA',
  	"headline_prefix" varchar DEFAULT 'Jadi strategis bisnis di era',
  	"subheadline" varchar,
  	"primary_label" varchar,
  	"mascot_pose" "enum__pages_v_blocks_hero_mascot_pose" DEFAULT 'greeting',
  	"quiz_label" varchar DEFAULT 'Cari jurusan yang cocok',
  	"whatsapp_label" varchar DEFAULT 'Chat via WhatsApp',
  	"brochure_label" varchar DEFAULT 'Unduh brosur',
  	"show_partner_strip" boolean DEFAULT true,
  	"partner_strip_label" varchar DEFAULT 'Akreditasi dan mitra',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"kind" "enum__pages_v_blocks_page_header_actions_kind" DEFAULT 'link',
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"highlight" varchar,
  	"intro" varchar,
  	"chip" varchar,
  	"mascot_pose" "enum__pages_v_blocks_page_header_mascot_pose" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"source" "enum__pages_v_blocks_stats_items_source" DEFAULT 'manual',
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_mbd_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"icon" "enum__pages_v_blocks_why_mbd_cards_icon" DEFAULT 'bintang',
  	"course_codes" varchar,
  	"size" "enum__pages_v_blocks_why_mbd_cards_size" DEFAULT 'normal',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_mbd" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_curriculum_track" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar DEFAULT 'KURIKULUM 8 SEMESTER',
  	"heading" varchar,
  	"intro" varchar,
  	"final_card_title" varchar DEFAULT 'Lihat kurikulum lengkap',
  	"final_card_body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_curriculum_explorer" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"show_search" boolean DEFAULT true,
  	"show_path_map" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faculty_highlight" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"limit" numeric DEFAULT 4,
  	"link_label" varchar DEFAULT 'Kenal semua dosen',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faculty_directory" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_latest_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"limit" numeric DEFAULT 3,
  	"link_label" varchar DEFAULT 'Semua artikel',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blog_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"page_size" numeric DEFAULT 9,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"variant" "enum__pages_v_blocks_cta_band_variant" DEFAULT 'full',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"mascot_pose" "enum__pages_v_blocks_cta_band_mascot_pose" DEFAULT 'pointing',
  	"show_secondary" boolean DEFAULT true,
  	"show_deadline" boolean DEFAULT true,
  	"deadline_label" varchar DEFAULT 'Batas akhir pendaftaran',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" uuid,
  	"mascot_pose" "enum__pages_v_blocks_image_text_mascot_pose" DEFAULT 'tablet',
  	"image_position" "enum__pages_v_blocks_image_text_image_position" DEFAULT 'right',
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar DEFAULT 'FAQ',
  	"heading" varchar,
  	"scope" "enum__pages_v_blocks_faq_scope" DEFAULT 'umum',
  	"limit" numeric DEFAULT 8,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"icon" "enum__pages_v_blocks_card_grid_cards_icon" DEFAULT 'bintang',
  	"tag" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"columns" "enum__pages_v_blocks_card_grid_columns" DEFAULT '3',
  	"style" "enum__pages_v_blocks_card_grid_style" DEFAULT 'sticker',
  	"mascot_pose" "enum__pages_v_blocks_card_grid_mascot_pose" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"url" varchar,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"source" "enum__pages_v_blocks_marquee_source" DEFAULT 'words',
  	"tone" "enum__pages_v_blocks_marquee_tone" DEFAULT 'navy',
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"form" "enum__pages_v_blocks_form_embed_form" DEFAULT 'kontak',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"mascot_pose" "enum__pages_v_blocks_form_embed_mascot_pose" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_career_paths" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"show_roadmap" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_job_board" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"empty_text" varchar DEFAULT 'Belum ada lowongan aktif. Cek lagi minggu depan, ya.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pmb_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"section" "enum__pages_v_blocks_pmb_info_section" DEFAULT 'tracks',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quiz_bands" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"min" numeric,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quiz" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"intro_title" varchar DEFAULT 'Kamu cocok jadi strategis yang mana?',
  	"intro_body" varchar,
  	"disclaimer" varchar DEFAULT 'Kuis ini panduan, bukan tes seleksi masuk.',
  	"lead_capture" boolean DEFAULT true,
  	"lead_heading" varchar DEFAULT 'Mau hasil ini dikirim ke WhatsApp-mu?',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"show_map" boolean DEFAULT true,
  	"show_hours" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_not_found_hero_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_not_found_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"visible" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"label" varchar DEFAULT 'RUTE TIDAK DITEMUKAN',
  	"line" varchar DEFAULT 'Waduh, halaman ini tidak ada di peta strategiku.',
  	"search_placeholder" varchar DEFAULT 'Cari mata kuliah, dosen, atau artikel',
  	"button_label" varchar DEFAULT 'Kembali ke Beranda',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean,
  	"version_meta_no_follow" boolean,
  	"version_meta_json_ld" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_is_system" boolean DEFAULT false,
  	"version_template" "enum__pages_v_version_template" DEFAULT 'standar',
  	"version_review_status" "enum__pages_v_version_review_status" DEFAULT 'none',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "posts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_id" uuid,
  	"content" jsonb,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean,
  	"meta_no_follow" boolean,
  	"meta_json_ld" boolean DEFAULT true,
  	"slug" varchar,
  	"category_id" uuid,
  	"author_id" uuid,
  	"author_name" varchar,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"reading_minutes" numeric,
  	"review_status" "enum_posts_review_status" DEFAULT 'none',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "posts_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"_status" "enum_posts_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" uuid,
  	"post_tags_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_posts_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" uuid,
  	"version_content" jsonb,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean,
  	"version_meta_no_follow" boolean,
  	"version_meta_json_ld" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_category_id" uuid,
  	"version_author_id" uuid,
  	"version_author_name" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_minutes" numeric,
  	"version_review_status" "enum__posts_v_version_review_status" DEFAULT 'none',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" uuid,
  	"post_tags_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "post_categories" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "post_categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_post_categories_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_description" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_post_categories_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "post_tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "post_tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_post_tags_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_post_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"_h_folders_id" uuid,
  	"uploaded_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_media_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_alt" varchar NOT NULL,
  	"version_caption" varchar,
  	"version__h_folders_id" uuid,
  	"version_uploaded_by_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_media_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "folders" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_h_folders_id" uuid,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "folders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_folders_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version__h_folders_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_folders_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_h_tags_id" uuid,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_tags_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version__h_tags_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "testimonials" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"class_year" varchar,
  	"workplace" varchar,
  	"quote" varchar NOT NULL,
  	"photo_id" uuid,
  	"approved" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_class_year" varchar,
  	"version_workplace" varchar,
  	"version_quote" varchar NOT NULL,
  	"version_photo_id" uuid,
  	"version_approved" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_testimonials_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "career_paths" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"role" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar,
  	"employers" varchar,
  	"salary_note" varchar,
  	"icon" "enum_career_paths_icon" DEFAULT 'bintang',
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "career_paths_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "career_paths_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_career_paths_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_role" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_summary" varchar,
  	"version_employers" varchar,
  	"version_salary_note" varchar,
  	"version_icon" "enum__career_paths_v_version_icon" DEFAULT 'bintang',
  	"version_is_active" boolean DEFAULT true,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_career_paths_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_career_paths_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "partners" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" uuid,
  	"url" varchar,
  	"kind" "enum_partners_kind" DEFAULT 'mitra',
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_partners_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_logo_id" uuid,
  	"version_url" varchar,
  	"version_kind" "enum__partners_v_version_kind" DEFAULT 'mitra',
  	"version_is_active" boolean DEFAULT true,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_partners_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "programs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"image_id" uuid,
  	"tag" varchar,
  	"link_href" varchar,
  	"mascot_pose" "enum_programs_mascot_pose" DEFAULT 'none',
  	"icon" "enum_programs_icon" DEFAULT 'bintang',
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_programs_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar NOT NULL,
  	"version_summary" varchar,
  	"version_image_id" uuid,
  	"version_tag" varchar,
  	"version_link_href" varchar,
  	"version_mascot_pose" "enum__programs_v_version_mascot_pose" DEFAULT 'none',
  	"version_icon" "enum__programs_v_version_icon" DEFAULT 'bintang',
  	"version_is_active" boolean DEFAULT true,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_programs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "job_posts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"location" varchar,
  	"type" "enum_job_posts_type" DEFAULT 'magang',
  	"deadline" timestamp(3) with time zone,
  	"apply_url" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_job_posts_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar NOT NULL,
  	"version_company" varchar NOT NULL,
  	"version_location" varchar,
  	"version_type" "enum__job_posts_v_version_type" DEFAULT 'magang',
  	"version_deadline" timestamp(3) with time zone,
  	"version_apply_url" varchar NOT NULL,
  	"version_description" varchar,
  	"version_is_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_job_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "faqs_scope" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_faqs_scope",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_faqs_v_version_scope" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum__faqs_v_version_scope",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_question" varchar NOT NULL,
  	"version_answer" varchar NOT NULL,
  	"version_is_active" boolean DEFAULT true,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_faqs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "curriculum_versions_semesters" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "curriculum_versions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"year" numeric,
  	"is_active" boolean DEFAULT false,
  	"status" "enum_curriculum_versions_status" DEFAULT 'draft',
  	"pdf_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "curriculum_versions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_curriculum_versions_v_version_semesters" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"number" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_curriculum_versions_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_year" numeric,
  	"version_is_active" boolean DEFAULT false,
  	"version_status" "enum__curriculum_versions_v_version_status" DEFAULT 'draft',
  	"version_pdf_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_curriculum_versions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "courses_tags" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_courses_tags",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "courses_cpmk" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "courses_weekly_plan" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"week" numeric,
  	"topic" varchar NOT NULL,
  	"method" varchar,
  	"outcome" varchar
  );
  
  CREATE TABLE "courses_assessment" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"component" varchar NOT NULL,
  	"weight" numeric
  );
  
  CREATE TABLE "courses_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "courses_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"code" varchar,
  	"name" varchar NOT NULL,
  	"name_source" varchar,
  	"semester" numeric NOT NULL,
  	"credits" numeric NOT NULL,
  	"type" "enum_courses_type" DEFAULT 'wajib',
  	"sort_order" numeric DEFAULT 0,
  	"short_description" varchar,
  	"description" varchar,
  	"rps_id" uuid,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean,
  	"meta_no_follow" boolean,
  	"meta_json_ld" boolean DEFAULT true,
  	"version_id" uuid NOT NULL,
  	"slug" varchar,
  	"is_visible" boolean DEFAULT true,
  	"syllabus_completeness" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "courses_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" uuid,
  	"faculty_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_courses_v_version_tags" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum__courses_v_version_tags",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "_courses_v_version_cpmk" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_weekly_plan" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"week" numeric,
  	"topic" varchar NOT NULL,
  	"method" varchar,
  	"outcome" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_assessment" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"component" varchar NOT NULL,
  	"weight" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v_version_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_code" varchar,
  	"version_name" varchar NOT NULL,
  	"version_name_source" varchar,
  	"version_semester" numeric NOT NULL,
  	"version_credits" numeric NOT NULL,
  	"version_type" "enum__courses_v_version_type" DEFAULT 'wajib',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_short_description" varchar,
  	"version_description" varchar,
  	"version_rps_id" uuid,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean,
  	"version_meta_no_follow" boolean,
  	"version_meta_json_ld" boolean DEFAULT true,
  	"version_version_id" uuid NOT NULL,
  	"version_slug" varchar,
  	"version_is_visible" boolean DEFAULT true,
  	"version_syllabus_completeness" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_courses_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_courses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" uuid,
  	"faculty_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "faculty_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"degree" varchar,
  	"institution" varchar,
  	"year" varchar
  );
  
  CREATE TABLE "faculty_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "faculty" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"title_front" varchar,
  	"title_back" varchar,
  	"nidn" varchar,
  	"position" varchar,
  	"photo_id" uuid,
  	"bio" varchar,
  	"links_sinta" varchar,
  	"links_scholar" varchar,
  	"links_linkedin" varchar,
  	"links_website" varchar,
  	"email" varchar,
  	"show_email" boolean,
  	"meta_canonical_url" varchar,
  	"meta_no_index" boolean,
  	"meta_no_follow" boolean,
  	"meta_json_ld" boolean DEFAULT true,
  	"slug" varchar,
  	"show_on_home" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "faculty_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" uuid,
  	"_status" "enum_faculty_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "faculty_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "faculty_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_faculty_v_version_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"degree" varchar,
  	"institution" varchar,
  	"year" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faculty_v_version_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"year" varchar,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_faculty_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar,
  	"version_title_front" varchar,
  	"version_title_back" varchar,
  	"version_nidn" varchar,
  	"version_position" varchar,
  	"version_photo_id" uuid,
  	"version_bio" varchar,
  	"version_links_sinta" varchar,
  	"version_links_scholar" varchar,
  	"version_links_linkedin" varchar,
  	"version_links_website" varchar,
  	"version_email" varchar,
  	"version_show_email" boolean,
  	"version_meta_canonical_url" varchar,
  	"version_meta_no_index" boolean,
  	"version_meta_no_follow" boolean,
  	"version_meta_json_ld" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_show_on_home" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"published_locale" "enum__faculty_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_faculty_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"version__status" "enum__faculty_v_version_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_faculty_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_faculty_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "pmb_applications_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"author_id" uuid,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pmb_applications_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from_status" "enum_pmb_applications_status_history_from_status",
  	"to_status" "enum_pmb_applications_status_history_to_status",
  	"changed_by_id" uuid,
  	"changed_at" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "pmb_applications" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"reg_number" varchar,
  	"status" "enum_pmb_applications_status" DEFAULT 'baru',
  	"assigned_to_id" uuid,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"city" varchar,
  	"school_name" varchar,
  	"school_major" varchar,
  	"graduation_year" numeric,
  	"wave_id" uuid,
  	"track_id" uuid,
  	"source" varchar,
  	"lead_id" uuid,
  	"possible_duplicate" boolean,
  	"duplicate_of_id" uuid,
  	"phone_normalized" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"utm" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pmb_applications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_pmb_applications_v_version_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar NOT NULL,
  	"author_id" uuid,
  	"created_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_applications_v_version_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"from_status" "enum__pmb_applications_v_version_status_history_from_status",
  	"to_status" "enum__pmb_applications_v_version_status_history_to_status",
  	"changed_by_id" uuid,
  	"changed_at" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_applications_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_reg_number" varchar,
  	"version_status" "enum__pmb_applications_v_version_status" DEFAULT 'baru',
  	"version_assigned_to_id" uuid,
  	"version_full_name" varchar NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_phone" varchar NOT NULL,
  	"version_city" varchar,
  	"version_school_name" varchar,
  	"version_school_major" varchar,
  	"version_graduation_year" numeric,
  	"version_wave_id" uuid,
  	"version_track_id" uuid,
  	"version_source" varchar,
  	"version_lead_id" uuid,
  	"version_possible_duplicate" boolean,
  	"version_duplicate_of_id" uuid,
  	"version_phone_normalized" varchar,
  	"version_consent_at" timestamp(3) with time zone,
  	"version_utm" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pmb_applications_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "leads_sources" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_leads_sources",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "leads_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL,
  	"author_id" uuid,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "leads" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar,
  	"phone_masked" varchar,
  	"email" varchar,
  	"school" varchar,
  	"status" "enum_leads_status" DEFAULT 'baru',
  	"assigned_to_id" uuid,
  	"follow_up_at" timestamp(3) with time zone,
  	"first_source" "enum_leads_first_source",
  	"quiz_archetype" varchar,
  	"quiz_attempt_id" uuid,
  	"application_id" uuid,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"deletion_requested" boolean,
  	"last_activity_at" timestamp(3) with time zone,
  	"phone_normalized" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "leads_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "leads_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_leads_v_version_sources" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum__leads_v_version_sources",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "_leads_v_version_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"note" varchar NOT NULL,
  	"author_id" uuid,
  	"created_at" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_leads_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_phone" varchar,
  	"version_phone_masked" varchar,
  	"version_email" varchar,
  	"version_school" varchar,
  	"version_status" "enum__leads_v_version_status" DEFAULT 'baru',
  	"version_assigned_to_id" uuid,
  	"version_follow_up_at" timestamp(3) with time zone,
  	"version_first_source" "enum__leads_v_version_first_source",
  	"version_quiz_archetype" varchar,
  	"version_quiz_attempt_id" uuid,
  	"version_application_id" uuid,
  	"version_utm_source" varchar,
  	"version_utm_medium" varchar,
  	"version_utm_campaign" varchar,
  	"version_consent_at" timestamp(3) with time zone,
  	"version_deletion_requested" boolean,
  	"version_last_activity_at" timestamp(3) with time zone,
  	"version_phone_normalized" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_leads_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_leads_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "contact_messages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"kind" "enum_contact_messages_kind" DEFAULT 'pesan',
  	"status" "enum_contact_messages_status" DEFAULT 'baru',
  	"topic" "enum_contact_messages_topic",
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"message" varchar,
  	"preferred_date" timestamp(3) with time zone,
  	"time_slot" "enum_contact_messages_time_slot",
  	"internal_note" varchar,
  	"lead_id" uuid,
  	"replied_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_contact_messages_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_kind" "enum__contact_messages_v_version_kind" DEFAULT 'pesan',
  	"version_status" "enum__contact_messages_v_version_status" DEFAULT 'baru',
  	"version_topic" "enum__contact_messages_v_version_topic",
  	"version_name" varchar NOT NULL,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_message" varchar,
  	"version_preferred_date" timestamp(3) with time zone,
  	"version_time_slot" "enum__contact_messages_v_version_time_slot",
  	"version_internal_note" varchar,
  	"version_lead_id" uuid,
  	"version_replied_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_contact_messages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "pmb_waves" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"open_date" timestamp(3) with time zone,
  	"close_date" timestamp(3) with time zone,
  	"quota" numeric,
  	"fee" varchar,
  	"status" "enum_pmb_waves_status" DEFAULT 'akan-datang',
  	"note" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pmb_waves_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_pmb_waves_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_open_date" timestamp(3) with time zone,
  	"version_close_date" timestamp(3) with time zone,
  	"version_quota" numeric,
  	"version_fee" varchar,
  	"version_status" "enum__pmb_waves_v_version_status" DEFAULT 'akan-datang',
  	"version_note" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pmb_waves_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "pmb_tracks_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pmb_tracks" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pmb_tracks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_pmb_tracks_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_tracks_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_description" varchar,
  	"version_is_active" boolean DEFAULT true,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pmb_tracks_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "message_templates" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"channel" "enum_message_templates_channel" DEFAULT 'email',
  	"status_key" "enum_message_templates_status_key" NOT NULL,
  	"subject" varchar,
  	"body" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "message_templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_message_templates_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_channel" "enum__message_templates_v_version_channel" DEFAULT 'email',
  	"version_status_key" "enum__message_templates_v_version_status_key" NOT NULL,
  	"version_subject" varchar,
  	"version_body" varchar NOT NULL,
  	"version_is_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_message_templates_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "pmb_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"type" "enum_pmb_documents_type" DEFAULT 'lainnya',
  	"application_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"original_filename" varchar,
  	"original_url" varchar,
  	"original_mime_type" varchar,
  	"original_filesize" numeric,
  	"original_width" numeric,
  	"original_height" numeric,
  	"original_prefix" varchar,
  	"original__objectkey" varchar,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pmb_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_pmb_documents_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_label" varchar,
  	"version_type" "enum__pmb_documents_v_version_type" DEFAULT 'lainnya',
  	"version_application_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_original_filename" varchar,
  	"version_original_url" varchar,
  	"version_original_mime_type" varchar,
  	"version_original_filesize" numeric,
  	"version_original_width" numeric,
  	"version_original_height" numeric,
  	"version_original_prefix" varchar,
  	"version_original__objectkey" varchar,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pmb_documents_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "quiz_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"weights_bisnis" numeric DEFAULT 0,
  	"weights_data" numeric DEFAULT 0,
  	"weights_teknologi" numeric DEFAULT 0,
  	"weights_kreatif" numeric DEFAULT 0
  );
  
  CREATE TABLE "quiz_questions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar NOT NULL,
  	"help_text" varchar,
  	"image_id" uuid,
  	"is_active" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quiz_questions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_quiz_questions_v_version_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"weights_bisnis" numeric DEFAULT 0,
  	"weights_data" numeric DEFAULT 0,
  	"weights_teknologi" numeric DEFAULT 0,
  	"weights_kreatif" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_quiz_questions_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_text" varchar NOT NULL,
  	"version_help_text" varchar,
  	"version_image_id" uuid,
  	"version_is_active" boolean DEFAULT true,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_quiz_questions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "quiz_results_semesters" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_quiz_results_semesters",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "quiz_results" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"archetype" varchar NOT NULL,
  	"pair_key" "enum_quiz_results_pair_key" NOT NULL,
  	"description" varchar NOT NULL,
  	"pose" "enum_quiz_results_pose" DEFAULT 'celebrating',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quiz_results_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "quiz_results_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_quiz_results_v_version_semesters" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum__quiz_results_v_version_semesters",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "_quiz_results_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_archetype" varchar NOT NULL,
  	"version_pair_key" "enum__quiz_results_v_version_pair_key" NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_pose" "enum__quiz_results_v_version_pose" DEFAULT 'celebrating',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_quiz_results_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_quiz_results_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" uuid,
  	"admins_id" uuid
  );
  
  CREATE TABLE "quiz_attempts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"result_id" uuid,
  	"match_percent" numeric,
  	"answers" jsonb,
  	"scores" jsonb,
  	"lead_id" uuid,
  	"session_id" varchar,
  	"is_test" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quiz_attempts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_quiz_attempts_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_result_id" uuid,
  	"version_match_percent" numeric,
  	"version_answers" jsonb,
  	"version_scores" jsonb,
  	"version_lead_id" uuid,
  	"version_session_id" varchar,
  	"version_is_test" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_quiz_attempts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"refresh_count" numeric,
  	"refreshed_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"role_id" uuid,
  	"status" "enum_admins_status" DEFAULT 'aktif',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "admins_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "roles" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"description" varchar,
  	"is_system" boolean DEFAULT false,
  	"permissions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "roles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_roles_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" varchar NOT NULL,
  	"version_key" varchar NOT NULL,
  	"version_description" varchar,
  	"version_is_system" boolean DEFAULT false,
  	"version_permissions" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_roles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "redirects" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"status_code" "enum_redirects_status_code" DEFAULT '301',
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_redirects_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_from" varchar NOT NULL,
  	"version_to" varchar NOT NULL,
  	"version_status_code" "enum__redirects_v_version_status_code" DEFAULT '301',
  	"version_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_redirects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "not_found_logs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"path" varchar NOT NULL,
  	"hits" numeric DEFAULT 0,
  	"last_seen_at" timestamp(3) with time zone,
  	"referrer" varchar,
  	"redirect_to" varchar,
  	"resolved" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "not_found_logs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_not_found_logs_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_path" varchar NOT NULL,
  	"version_hits" numeric DEFAULT 0,
  	"version_last_seen_at" timestamp(3) with time zone,
  	"version_referrer" varchar,
  	"version_redirect_to" varchar,
  	"version_resolved" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_not_found_logs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "audit_logs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"user_id" uuid,
  	"action" "enum_audit_logs_action",
  	"entity_type" varchar,
  	"entity_id" varchar,
  	"entity_title" varchar,
  	"changes" jsonb,
  	"ip" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_audit_logs_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_user_id" uuid,
  	"version_action" "enum__audit_logs_v_version_action",
  	"version_entity_type" varchar,
  	"version_entity_id" varchar,
  	"version_entity_title" varchar,
  	"version_changes" jsonb,
  	"version_ip" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_audit_logs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "analytics_events" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" "enum_analytics_events_name" NOT NULL,
  	"path" varchar,
  	"session_id" varchar,
  	"referrer" varchar,
  	"props" jsonb,
  	"lead_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_analytics_events_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_name" "enum__analytics_events_v_version_name" NOT NULL,
  	"version_path" varchar,
  	"version_session_id" varchar,
  	"version_referrer" varchar,
  	"version_props" jsonb,
  	"version_lead_id" uuid,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_analytics_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb NOT NULL,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb,
  	"parent_task_slug" "enum_payload_jobs_log_parent_task_slug",
  	"parent_task_i_d" varchar
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"input" jsonb,
  	"meta" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing_until" timestamp(3) with time zone,
  	"processing_token" varchar,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid,
  	"posts_id" uuid,
  	"post_categories_id" uuid,
  	"post_tags_id" uuid,
  	"media_id" uuid,
  	"folders_id" uuid,
  	"tags_id" uuid,
  	"testimonials_id" uuid,
  	"career_paths_id" uuid,
  	"partners_id" uuid,
  	"programs_id" uuid,
  	"job_posts_id" uuid,
  	"faqs_id" uuid,
  	"curriculum_versions_id" uuid,
  	"courses_id" uuid,
  	"faculty_id" uuid,
  	"pmb_applications_id" uuid,
  	"leads_id" uuid,
  	"contact_messages_id" uuid,
  	"pmb_waves_id" uuid,
  	"pmb_tracks_id" uuid,
  	"message_templates_id" uuid,
  	"pmb_documents_id" uuid,
  	"quiz_questions_id" uuid,
  	"quiz_results_id" uuid,
  	"quiz_attempts_id" uuid,
  	"admins_id" uuid,
  	"roles_id" uuid,
  	"redirects_id" uuid,
  	"not_found_logs_id" uuid,
  	"audit_logs_id" uuid,
  	"analytics_events_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_slug" varchar NOT NULL,
  	"entity_type" "enum_payload_llm_instructions_entity_type" NOT NULL,
  	"additional_instructions" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_llm_instructions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_name" varchar DEFAULT 'Arus Digital',
  	"program_name" varchar DEFAULT 'S1 Manajemen Bisnis Digital',
  	"institution_name" varchar DEFAULT 'Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)',
  	"tagline" varchar,
  	"short_description" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"service_hours" varchar,
  	"map_lat" numeric,
  	"map_lng" numeric,
  	"accreditation_text" varchar DEFAULT '[ISI: status akreditasi]',
  	"accreditation_badge_id" uuid,
  	"features_show_total_sks" boolean DEFAULT false,
  	"features_external_registration_url" varchar,
  	"features_show_placeholders" boolean DEFAULT true,
  	"features_default_reduced_motion" boolean DEFAULT false,
  	"features_maintenance_mode" boolean DEFAULT false,
  	"integrations_ga4_id" varchar,
  	"integrations_meta_pixel_id" varchar,
  	"integrations_turnstile_site_key" varchar,
  	"integrations_custom_head_scripts" varchar,
  	"integrations_custom_body_scripts" varchar,
  	"title_template" varchar DEFAULT '%s · MBD ISTTS',
  	"default_description" varchar,
  	"default_og_image_id" uuid,
  	"robots_txt" varchar,
  	"privacy_page_id" uuid,
  	"terms_page_id" uuid,
  	"upload_limits_image" numeric DEFAULT 8,
  	"upload_limits_pdf" numeric DEFAULT 20,
  	"upload_limits_video" numeric DEFAULT 60,
  	"upload_limits_model" numeric DEFAULT 3,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_site_settings_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"platform" "enum__site_settings_v_version_socials_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_site_name" varchar DEFAULT 'Arus Digital',
  	"version_program_name" varchar DEFAULT 'S1 Manajemen Bisnis Digital',
  	"version_institution_name" varchar DEFAULT 'Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)',
  	"version_tagline" varchar,
  	"version_short_description" varchar,
  	"version_address" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_service_hours" varchar,
  	"version_map_lat" numeric,
  	"version_map_lng" numeric,
  	"version_accreditation_text" varchar DEFAULT '[ISI: status akreditasi]',
  	"version_accreditation_badge_id" uuid,
  	"version_features_show_total_sks" boolean DEFAULT false,
  	"version_features_external_registration_url" varchar,
  	"version_features_show_placeholders" boolean DEFAULT true,
  	"version_features_default_reduced_motion" boolean DEFAULT false,
  	"version_features_maintenance_mode" boolean DEFAULT false,
  	"version_integrations_ga4_id" varchar,
  	"version_integrations_meta_pixel_id" varchar,
  	"version_integrations_turnstile_site_key" varchar,
  	"version_integrations_custom_head_scripts" varchar,
  	"version_integrations_custom_body_scripts" varchar,
  	"version_title_template" varchar DEFAULT '%s · MBD ISTTS',
  	"version_default_description" varchar,
  	"version_default_og_image_id" uuid,
  	"version_robots_txt" varchar,
  	"version_privacy_page_id" uuid,
  	"version_terms_page_id" uuid,
  	"version_upload_limits_image" numeric DEFAULT 8,
  	"version_upload_limits_pdf" numeric DEFAULT 20,
  	"version_upload_limits_video" numeric DEFAULT 60,
  	"version_upload_limits_model" numeric DEFAULT 3,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "branding_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pose" "enum_branding_lines_pose" NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "branding" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"wordmark_light_id" uuid,
  	"wordmark_dark_id" uuid,
  	"symbol_id" uuid,
  	"favicon_id" uuid,
  	"og_default_id" uuid,
  	"colors_blue" varchar DEFAULT '#1A6BFF',
  	"colors_navy" varchar DEFAULT '#071A3D',
  	"colors_lime" varchar DEFAULT '#C6F432',
  	"colors_cyan" varchar DEFAULT '#2EE6F6',
  	"mascot_name" varchar DEFAULT 'Siasat',
  	"mascot_nickname" varchar DEFAULT 'Sia',
  	"mascot_tagline" varchar DEFAULT 'Si Strategis',
  	"mascot_bio" varchar,
  	"mascot_settings_eye_follow" boolean DEFAULT true,
  	"mascot_settings_tap_to_talk" boolean DEFAULT true,
  	"mascot_settings_idle_animation" boolean DEFAULT true,
  	"poses_greeting_image_id" uuid,
  	"poses_greeting_image2x_id" uuid,
  	"poses_greeting_alt" varchar,
  	"poses_pointing_image_id" uuid,
  	"poses_pointing_image2x_id" uuid,
  	"poses_pointing_alt" varchar,
  	"poses_thinking_image_id" uuid,
  	"poses_thinking_image2x_id" uuid,
  	"poses_thinking_alt" varchar,
  	"poses_celebrating_image_id" uuid,
  	"poses_celebrating_image2x_id" uuid,
  	"poses_celebrating_alt" varchar,
  	"poses_confused_image_id" uuid,
  	"poses_confused_image2x_id" uuid,
  	"poses_confused_alt" varchar,
  	"poses_tablet_image_id" uuid,
  	"poses_tablet_image2x_id" uuid,
  	"poses_tablet_alt" varchar,
  	"glb_model_id" uuid,
  	"patterns_wave_enabled" boolean DEFAULT true,
  	"patterns_wave_intensity" numeric DEFAULT 70,
  	"patterns_fin_enabled" boolean DEFAULT true,
  	"patterns_fin_intensity" numeric DEFAULT 70,
  	"patterns_star_enabled" boolean DEFAULT true,
  	"patterns_star_intensity" numeric DEFAULT 70,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "branding_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_branding_v_version_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"pose" "enum__branding_v_version_lines_pose" NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_branding_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_wordmark_light_id" uuid,
  	"version_wordmark_dark_id" uuid,
  	"version_symbol_id" uuid,
  	"version_favicon_id" uuid,
  	"version_og_default_id" uuid,
  	"version_colors_blue" varchar DEFAULT '#1A6BFF',
  	"version_colors_navy" varchar DEFAULT '#071A3D',
  	"version_colors_lime" varchar DEFAULT '#C6F432',
  	"version_colors_cyan" varchar DEFAULT '#2EE6F6',
  	"version_mascot_name" varchar DEFAULT 'Siasat',
  	"version_mascot_nickname" varchar DEFAULT 'Sia',
  	"version_mascot_tagline" varchar DEFAULT 'Si Strategis',
  	"version_mascot_bio" varchar,
  	"version_mascot_settings_eye_follow" boolean DEFAULT true,
  	"version_mascot_settings_tap_to_talk" boolean DEFAULT true,
  	"version_mascot_settings_idle_animation" boolean DEFAULT true,
  	"version_poses_greeting_image_id" uuid,
  	"version_poses_greeting_image2x_id" uuid,
  	"version_poses_greeting_alt" varchar,
  	"version_poses_pointing_image_id" uuid,
  	"version_poses_pointing_image2x_id" uuid,
  	"version_poses_pointing_alt" varchar,
  	"version_poses_thinking_image_id" uuid,
  	"version_poses_thinking_image2x_id" uuid,
  	"version_poses_thinking_alt" varchar,
  	"version_poses_celebrating_image_id" uuid,
  	"version_poses_celebrating_image2x_id" uuid,
  	"version_poses_celebrating_alt" varchar,
  	"version_poses_confused_image_id" uuid,
  	"version_poses_confused_image2x_id" uuid,
  	"version_poses_confused_alt" varchar,
  	"version_poses_tablet_image_id" uuid,
  	"version_poses_tablet_image2x_id" uuid,
  	"version_poses_tablet_alt" varchar,
  	"version_glb_model_id" uuid,
  	"version_patterns_wave_enabled" boolean DEFAULT true,
  	"version_patterns_wave_intensity" numeric DEFAULT 70,
  	"version_patterns_fin_enabled" boolean DEFAULT true,
  	"version_patterns_fin_intensity" numeric DEFAULT 70,
  	"version_patterns_star_enabled" boolean DEFAULT true,
  	"version_patterns_star_intensity" numeric DEFAULT 70,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_branding_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "navigation_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_header_children_link_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" uuid,
  	"post_id" uuid,
  	"course_id" uuid,
  	"url" varchar,
  	"anchor" varchar,
  	"new_tab" boolean,
  	"is_visible" boolean DEFAULT true,
  	"as_button" boolean
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_header_link_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" uuid,
  	"post_id" uuid,
  	"course_id" uuid,
  	"url" varchar,
  	"anchor" varchar,
  	"new_tab" boolean,
  	"is_visible" boolean DEFAULT true,
  	"as_button" boolean
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_footer_columns_links_link_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" uuid,
  	"post_id" uuid,
  	"course_id" uuid,
  	"url" varchar,
  	"anchor" varchar,
  	"new_tab" boolean,
  	"is_visible" boolean DEFAULT true,
  	"as_button" boolean
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mobile_bar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_navigation_mobile_bar_items_kind" NOT NULL,
  	"label" varchar,
  	"is_visible" boolean DEFAULT true
  );
  
  CREATE TABLE "navigation" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"cta_primary_label" varchar DEFAULT 'Daftar Sekarang',
  	"cta_primary_path" varchar DEFAULT '/pmb',
  	"cta_whatsapp_number" varchar DEFAULT '[ISI]',
  	"cta_whatsapp_label" varchar DEFAULT 'Chat via WhatsApp',
  	"cta_whatsapp_message" varchar,
  	"cta_quiz_label" varchar DEFAULT 'Cari Jurusan yang Cocok',
  	"cta_brochure_label" varchar DEFAULT 'Unduh Brosur',
  	"cta_brochure_file_id" uuid,
  	"mobile_bar_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_navigation_v_version_header_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum__navigation_v_version_header_children_link_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" uuid,
  	"post_id" uuid,
  	"course_id" uuid,
  	"url" varchar,
  	"anchor" varchar,
  	"new_tab" boolean,
  	"is_visible" boolean DEFAULT true,
  	"as_button" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum__navigation_v_version_header_link_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" uuid,
  	"post_id" uuid,
  	"course_id" uuid,
  	"url" varchar,
  	"anchor" varchar,
  	"new_tab" boolean,
  	"is_visible" boolean DEFAULT true,
  	"as_button" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum__navigation_v_version_footer_columns_links_link_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" uuid,
  	"post_id" uuid,
  	"course_id" uuid,
  	"url" varchar,
  	"anchor" varchar,
  	"new_tab" boolean,
  	"is_visible" boolean DEFAULT true,
  	"as_button" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_mobile_bar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"kind" "enum__navigation_v_version_mobile_bar_items_kind" NOT NULL,
  	"label" varchar,
  	"is_visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_cta_primary_label" varchar DEFAULT 'Daftar Sekarang',
  	"version_cta_primary_path" varchar DEFAULT '/pmb',
  	"version_cta_whatsapp_number" varchar DEFAULT '[ISI]',
  	"version_cta_whatsapp_label" varchar DEFAULT 'Chat via WhatsApp',
  	"version_cta_whatsapp_message" varchar,
  	"version_cta_quiz_label" varchar DEFAULT 'Cari Jurusan yang Cocok',
  	"version_cta_brochure_label" varchar DEFAULT 'Unduh Brosur',
  	"version_cta_brochure_file_id" uuid,
  	"version_mobile_bar_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_navigation_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "pmb_settings_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pmb_settings_fees" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"amount" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pmb_settings_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pmb_settings_source_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pmb_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"academic_year" varchar DEFAULT '[ISI: tahun akademik]',
  	"fees_note" varchar,
  	"document_upload_enabled" boolean DEFAULT false,
  	"max_document_mb" numeric DEFAULT 2,
  	"success_title" varchar DEFAULT 'Yeay! Langkah pertamamu sudah tercatat.',
  	"success_body" varchar,
  	"status_intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pmb_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "_pmb_settings_v_version_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_settings_v_version_fees" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"item" varchar NOT NULL,
  	"amount" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_settings_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_settings_v_version_source_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pmb_settings_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_academic_year" varchar DEFAULT '[ISI: tahun akademik]',
  	"version_fees_note" varchar,
  	"version_document_upload_enabled" boolean DEFAULT false,
  	"version_max_document_mb" numeric DEFAULT 2,
  	"version_success_title" varchar DEFAULT 'Yeay! Langkah pertamamu sudah tercatat.',
  	"version_success_body" varchar,
  	"version_status_intro" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pmb_settings_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_hero_rotating_words" ADD CONSTRAINT "pages_blocks_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_orbit_chips" ADD CONSTRAINT "pages_blocks_hero_orbit_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header_actions" ADD CONSTRAINT "pages_blocks_page_header_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_page_header" ADD CONSTRAINT "pages_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_mbd_cards" ADD CONSTRAINT "pages_blocks_why_mbd_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_why_mbd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_mbd" ADD CONSTRAINT "pages_blocks_why_mbd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_curriculum_track" ADD CONSTRAINT "pages_blocks_curriculum_track_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_curriculum_explorer" ADD CONSTRAINT "pages_blocks_curriculum_explorer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faculty_highlight" ADD CONSTRAINT "pages_blocks_faculty_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faculty_directory" ADD CONSTRAINT "pages_blocks_faculty_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_posts" ADD CONSTRAINT "pages_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_index" ADD CONSTRAINT "pages_blocks_blog_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee_words" ADD CONSTRAINT "pages_blocks_marquee_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marquee" ADD CONSTRAINT "pages_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_embed" ADD CONSTRAINT "pages_blocks_form_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_programs" ADD CONSTRAINT "pages_blocks_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_career_paths" ADD CONSTRAINT "pages_blocks_career_paths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_job_board" ADD CONSTRAINT "pages_blocks_job_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pmb_info" ADD CONSTRAINT "pages_blocks_pmb_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quiz_bands" ADD CONSTRAINT "pages_blocks_quiz_bands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quiz" ADD CONSTRAINT "pages_blocks_quiz_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_info" ADD CONSTRAINT "pages_blocks_contact_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_not_found_hero_quick_links" ADD CONSTRAINT "pages_blocks_not_found_hero_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_not_found_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_not_found_hero" ADD CONSTRAINT "pages_blocks_not_found_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_rotating_words" ADD CONSTRAINT "_pages_v_blocks_hero_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_orbit_chips" ADD CONSTRAINT "_pages_v_blocks_hero_orbit_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header_actions" ADD CONSTRAINT "_pages_v_blocks_page_header_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_header" ADD CONSTRAINT "_pages_v_blocks_page_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_mbd_cards" ADD CONSTRAINT "_pages_v_blocks_why_mbd_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_why_mbd"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_mbd" ADD CONSTRAINT "_pages_v_blocks_why_mbd_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_curriculum_track" ADD CONSTRAINT "_pages_v_blocks_curriculum_track_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_curriculum_explorer" ADD CONSTRAINT "_pages_v_blocks_curriculum_explorer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faculty_highlight" ADD CONSTRAINT "_pages_v_blocks_faculty_highlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faculty_directory" ADD CONSTRAINT "_pages_v_blocks_faculty_directory_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts" ADD CONSTRAINT "_pages_v_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog_index" ADD CONSTRAINT "_pages_v_blocks_blog_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee_words" ADD CONSTRAINT "_pages_v_blocks_marquee_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marquee" ADD CONSTRAINT "_pages_v_blocks_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_embed" ADD CONSTRAINT "_pages_v_blocks_form_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_programs" ADD CONSTRAINT "_pages_v_blocks_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_career_paths" ADD CONSTRAINT "_pages_v_blocks_career_paths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_job_board" ADD CONSTRAINT "_pages_v_blocks_job_board_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pmb_info" ADD CONSTRAINT "_pages_v_blocks_pmb_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quiz_bands" ADD CONSTRAINT "_pages_v_blocks_quiz_bands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_quiz"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quiz" ADD CONSTRAINT "_pages_v_blocks_quiz_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_info" ADD CONSTRAINT "_pages_v_blocks_contact_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_not_found_hero_quick_links" ADD CONSTRAINT "_pages_v_blocks_not_found_hero_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_not_found_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_not_found_hero" ADD CONSTRAINT "_pages_v_blocks_not_found_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_post_tags_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_admins_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_post_tags_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_post_categories_v" ADD CONSTRAINT "_post_categories_v_parent_id_post_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_post_categories_v_rels" ADD CONSTRAINT "_post_categories_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_post_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_post_categories_v_rels" ADD CONSTRAINT "_post_categories_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_tags_rels" ADD CONSTRAINT "post_tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_tags_rels" ADD CONSTRAINT "post_tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_post_tags_v" ADD CONSTRAINT "_post_tags_v_parent_id_post_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_post_tags_v_rels" ADD CONSTRAINT "_post_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_post_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_post_tags_v_rels" ADD CONSTRAINT "_post_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_admins_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_rels" ADD CONSTRAINT "media_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_uploaded_by_id_admins_id_fk" FOREIGN KEY ("version_uploaded_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_v_rels" ADD CONSTRAINT "_media_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders" ADD CONSTRAINT "folders__h_folders_id_folders_id_fk" FOREIGN KEY ("_h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "folders_rels" ADD CONSTRAINT "folders_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v" ADD CONSTRAINT "_folders_v_version__h_folders_id_folders_id_fk" FOREIGN KEY ("version__h_folders_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_folders_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_folders_v_rels" ADD CONSTRAINT "_folders_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags__h_tags_id_tags_id_fk" FOREIGN KEY ("_h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_rels" ADD CONSTRAINT "tags_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_version__h_tags_id_tags_id_fk" FOREIGN KEY ("version__h_tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tags_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tags_v_rels" ADD CONSTRAINT "_tags_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_paths_texts" ADD CONSTRAINT "career_paths_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_paths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_paths_rels" ADD CONSTRAINT "career_paths_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_paths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_paths_rels" ADD CONSTRAINT "career_paths_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "career_paths_rels" ADD CONSTRAINT "career_paths_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_paths_v" ADD CONSTRAINT "_career_paths_v_parent_id_career_paths_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_paths"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_career_paths_v_texts" ADD CONSTRAINT "_career_paths_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_career_paths_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_paths_v_rels" ADD CONSTRAINT "_career_paths_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_career_paths_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_paths_v_rels" ADD CONSTRAINT "_career_paths_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_career_paths_v_rels" ADD CONSTRAINT "_career_paths_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_rels" ADD CONSTRAINT "partners_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_rels" ADD CONSTRAINT "_partners_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v_rels" ADD CONSTRAINT "_partners_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_posts_rels" ADD CONSTRAINT "job_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_posts_rels" ADD CONSTRAINT "job_posts_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_posts_v" ADD CONSTRAINT "_job_posts_v_parent_id_job_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."job_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_job_posts_v_rels" ADD CONSTRAINT "_job_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_job_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_job_posts_v_rels" ADD CONSTRAINT "_job_posts_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_scope" ADD CONSTRAINT "faqs_scope_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_version_scope" ADD CONSTRAINT "_faqs_v_version_scope_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v_rels" ADD CONSTRAINT "_faqs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faqs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faqs_v_rels" ADD CONSTRAINT "_faqs_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "curriculum_versions_semesters" ADD CONSTRAINT "curriculum_versions_semesters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."curriculum_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "curriculum_versions" ADD CONSTRAINT "curriculum_versions_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "curriculum_versions_rels" ADD CONSTRAINT "curriculum_versions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."curriculum_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "curriculum_versions_rels" ADD CONSTRAINT "curriculum_versions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_curriculum_versions_v_version_semesters" ADD CONSTRAINT "_curriculum_versions_v_version_semesters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_curriculum_versions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_curriculum_versions_v" ADD CONSTRAINT "_curriculum_versions_v_parent_id_curriculum_versions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."curriculum_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_curriculum_versions_v" ADD CONSTRAINT "_curriculum_versions_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_curriculum_versions_v_rels" ADD CONSTRAINT "_curriculum_versions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_curriculum_versions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_curriculum_versions_v_rels" ADD CONSTRAINT "_curriculum_versions_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_tags" ADD CONSTRAINT "courses_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_cpmk" ADD CONSTRAINT "courses_cpmk_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_weekly_plan" ADD CONSTRAINT "courses_weekly_plan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_assessment" ADD CONSTRAINT "courses_assessment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_references" ADD CONSTRAINT "courses_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_tools" ADD CONSTRAINT "courses_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_rps_id_media_id_fk" FOREIGN KEY ("rps_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_version_id_curriculum_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."curriculum_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_locales" ADD CONSTRAINT "courses_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_locales" ADD CONSTRAINT "courses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_faculty_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_tags" ADD CONSTRAINT "_courses_v_version_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_cpmk" ADD CONSTRAINT "_courses_v_version_cpmk_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_weekly_plan" ADD CONSTRAINT "_courses_v_version_weekly_plan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_assessment" ADD CONSTRAINT "_courses_v_version_assessment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_references" ADD CONSTRAINT "_courses_v_version_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_tools" ADD CONSTRAINT "_courses_v_version_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_rps_id_media_id_fk" FOREIGN KEY ("version_rps_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_version_id_curriculum_versions_id_fk" FOREIGN KEY ("version_version_id") REFERENCES "public"."curriculum_versions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_locales" ADD CONSTRAINT "_courses_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_locales" ADD CONSTRAINT "_courses_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_faculty_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_education" ADD CONSTRAINT "faculty_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_publications" ADD CONSTRAINT "faculty_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty" ADD CONSTRAINT "faculty_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculty_locales" ADD CONSTRAINT "faculty_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculty_locales" ADD CONSTRAINT "faculty_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_texts" ADD CONSTRAINT "faculty_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_rels" ADD CONSTRAINT "faculty_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faculty_rels" ADD CONSTRAINT "faculty_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v_version_education" ADD CONSTRAINT "_faculty_v_version_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faculty_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v_version_publications" ADD CONSTRAINT "_faculty_v_version_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faculty_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v" ADD CONSTRAINT "_faculty_v_parent_id_faculty_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faculty"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faculty_v" ADD CONSTRAINT "_faculty_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faculty_v_locales" ADD CONSTRAINT "_faculty_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faculty_v_locales" ADD CONSTRAINT "_faculty_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faculty_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v_texts" ADD CONSTRAINT "_faculty_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faculty_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v_rels" ADD CONSTRAINT "_faculty_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faculty_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faculty_v_rels" ADD CONSTRAINT "_faculty_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_applications_notes" ADD CONSTRAINT "pmb_applications_notes_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications_notes" ADD CONSTRAINT "pmb_applications_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_applications_status_history" ADD CONSTRAINT "pmb_applications_status_history_changed_by_id_admins_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications_status_history" ADD CONSTRAINT "pmb_applications_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_applications" ADD CONSTRAINT "pmb_applications_assigned_to_id_admins_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications" ADD CONSTRAINT "pmb_applications_wave_id_pmb_waves_id_fk" FOREIGN KEY ("wave_id") REFERENCES "public"."pmb_waves"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications" ADD CONSTRAINT "pmb_applications_track_id_pmb_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."pmb_tracks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications" ADD CONSTRAINT "pmb_applications_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications" ADD CONSTRAINT "pmb_applications_duplicate_of_id_pmb_applications_id_fk" FOREIGN KEY ("duplicate_of_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_applications_rels" ADD CONSTRAINT "pmb_applications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_applications_rels" ADD CONSTRAINT "pmb_applications_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_version_notes" ADD CONSTRAINT "_pmb_applications_v_version_notes_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_version_notes" ADD CONSTRAINT "_pmb_applications_v_version_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_applications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_version_status_history" ADD CONSTRAINT "_pmb_applications_v_version_status_history_changed_by_id_admins_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_version_status_history" ADD CONSTRAINT "_pmb_applications_v_version_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_applications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v" ADD CONSTRAINT "_pmb_applications_v_parent_id_pmb_applications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v" ADD CONSTRAINT "_pmb_applications_v_version_assigned_to_id_admins_id_fk" FOREIGN KEY ("version_assigned_to_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v" ADD CONSTRAINT "_pmb_applications_v_version_wave_id_pmb_waves_id_fk" FOREIGN KEY ("version_wave_id") REFERENCES "public"."pmb_waves"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v" ADD CONSTRAINT "_pmb_applications_v_version_track_id_pmb_tracks_id_fk" FOREIGN KEY ("version_track_id") REFERENCES "public"."pmb_tracks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v" ADD CONSTRAINT "_pmb_applications_v_version_lead_id_leads_id_fk" FOREIGN KEY ("version_lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v" ADD CONSTRAINT "_pmb_applications_v_version_duplicate_of_id_pmb_applications_id_fk" FOREIGN KEY ("version_duplicate_of_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_rels" ADD CONSTRAINT "_pmb_applications_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pmb_applications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_applications_v_rels" ADD CONSTRAINT "_pmb_applications_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_sources" ADD CONSTRAINT "leads_sources_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_notes" ADD CONSTRAINT "leads_notes_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_notes" ADD CONSTRAINT "leads_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_admins_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_quiz_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("quiz_attempt_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_application_id_pmb_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_texts" ADD CONSTRAINT "leads_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v_version_sources" ADD CONSTRAINT "_leads_v_version_sources_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v_version_notes" ADD CONSTRAINT "_leads_v_version_notes_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v_version_notes" ADD CONSTRAINT "_leads_v_version_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_parent_id_leads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_assigned_to_id_admins_id_fk" FOREIGN KEY ("version_assigned_to_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_quiz_attempt_id_quiz_attempts_id_fk" FOREIGN KEY ("version_quiz_attempt_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v" ADD CONSTRAINT "_leads_v_version_application_id_pmb_applications_id_fk" FOREIGN KEY ("version_application_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_leads_v_texts" ADD CONSTRAINT "_leads_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v_rels" ADD CONSTRAINT "_leads_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_leads_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_leads_v_rels" ADD CONSTRAINT "_leads_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_messages_rels" ADD CONSTRAINT "contact_messages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages_rels" ADD CONSTRAINT "contact_messages_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_messages_v" ADD CONSTRAINT "_contact_messages_v_parent_id_contact_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_messages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_messages_v" ADD CONSTRAINT "_contact_messages_v_version_lead_id_leads_id_fk" FOREIGN KEY ("version_lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_messages_v_rels" ADD CONSTRAINT "_contact_messages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_contact_messages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_messages_v_rels" ADD CONSTRAINT "_contact_messages_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_waves_rels" ADD CONSTRAINT "pmb_waves_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_waves"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_waves_rels" ADD CONSTRAINT "pmb_waves_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_waves_v" ADD CONSTRAINT "_pmb_waves_v_parent_id_pmb_waves_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_waves"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_waves_v_rels" ADD CONSTRAINT "_pmb_waves_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pmb_waves_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_waves_v_rels" ADD CONSTRAINT "_pmb_waves_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_tracks_highlights" ADD CONSTRAINT "pmb_tracks_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_tracks_rels" ADD CONSTRAINT "pmb_tracks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_tracks_rels" ADD CONSTRAINT "pmb_tracks_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_tracks_v_version_highlights" ADD CONSTRAINT "_pmb_tracks_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_tracks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_tracks_v" ADD CONSTRAINT "_pmb_tracks_v_parent_id_pmb_tracks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_tracks"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_tracks_v_rels" ADD CONSTRAINT "_pmb_tracks_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pmb_tracks_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_tracks_v_rels" ADD CONSTRAINT "_pmb_tracks_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "message_templates_rels" ADD CONSTRAINT "message_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."message_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "message_templates_rels" ADD CONSTRAINT "message_templates_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_message_templates_v" ADD CONSTRAINT "_message_templates_v_parent_id_message_templates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."message_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_message_templates_v_rels" ADD CONSTRAINT "_message_templates_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_message_templates_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_message_templates_v_rels" ADD CONSTRAINT "_message_templates_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_documents" ADD CONSTRAINT "pmb_documents_application_id_pmb_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pmb_documents_rels" ADD CONSTRAINT "pmb_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_documents_rels" ADD CONSTRAINT "pmb_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_documents_v" ADD CONSTRAINT "_pmb_documents_v_parent_id_pmb_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_documents_v" ADD CONSTRAINT "_pmb_documents_v_version_application_id_pmb_applications_id_fk" FOREIGN KEY ("version_application_id") REFERENCES "public"."pmb_applications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pmb_documents_v_rels" ADD CONSTRAINT "_pmb_documents_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pmb_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_documents_v_rels" ADD CONSTRAINT "_pmb_documents_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_questions_options" ADD CONSTRAINT "quiz_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quiz_questions_rels" ADD CONSTRAINT "quiz_questions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_questions_rels" ADD CONSTRAINT "quiz_questions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_questions_v_version_options" ADD CONSTRAINT "_quiz_questions_v_version_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quiz_questions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_questions_v" ADD CONSTRAINT "_quiz_questions_v_parent_id_quiz_questions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_questions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quiz_questions_v" ADD CONSTRAINT "_quiz_questions_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quiz_questions_v_rels" ADD CONSTRAINT "_quiz_questions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_quiz_questions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_questions_v_rels" ADD CONSTRAINT "_quiz_questions_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_results_semesters" ADD CONSTRAINT "quiz_results_semesters_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_results_texts" ADD CONSTRAINT "quiz_results_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_results_rels" ADD CONSTRAINT "quiz_results_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_results_rels" ADD CONSTRAINT "quiz_results_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_results_rels" ADD CONSTRAINT "quiz_results_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_results_v_version_semesters" ADD CONSTRAINT "_quiz_results_v_version_semesters_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_quiz_results_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_results_v" ADD CONSTRAINT "_quiz_results_v_parent_id_quiz_results_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_results"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quiz_results_v_texts" ADD CONSTRAINT "_quiz_results_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_quiz_results_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_results_v_rels" ADD CONSTRAINT "_quiz_results_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_quiz_results_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_results_v_rels" ADD CONSTRAINT "_quiz_results_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_results_v_rels" ADD CONSTRAINT "_quiz_results_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_result_id_quiz_results_id_fk" FOREIGN KEY ("result_id") REFERENCES "public"."quiz_results"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quiz_attempts_rels" ADD CONSTRAINT "quiz_attempts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_attempts_rels" ADD CONSTRAINT "quiz_attempts_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_attempts_v" ADD CONSTRAINT "_quiz_attempts_v_parent_id_quiz_attempts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quiz_attempts_v" ADD CONSTRAINT "_quiz_attempts_v_version_result_id_quiz_results_id_fk" FOREIGN KEY ("version_result_id") REFERENCES "public"."quiz_results"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quiz_attempts_v" ADD CONSTRAINT "_quiz_attempts_v_version_lead_id_leads_id_fk" FOREIGN KEY ("version_lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quiz_attempts_v_rels" ADD CONSTRAINT "_quiz_attempts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_quiz_attempts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quiz_attempts_v_rels" ADD CONSTRAINT "_quiz_attempts_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins" ADD CONSTRAINT "admins_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "admins_rels" ADD CONSTRAINT "admins_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roles_rels" ADD CONSTRAINT "roles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "roles_rels" ADD CONSTRAINT "roles_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roles_v" ADD CONSTRAINT "_roles_v_parent_id_roles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_roles_v_rels" ADD CONSTRAINT "_roles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_roles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_roles_v_rels" ADD CONSTRAINT "_roles_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_redirects_v" ADD CONSTRAINT "_redirects_v_parent_id_redirects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_redirects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "not_found_logs_rels" ADD CONSTRAINT "not_found_logs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."not_found_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "not_found_logs_rels" ADD CONSTRAINT "not_found_logs_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_not_found_logs_v" ADD CONSTRAINT "_not_found_logs_v_parent_id_not_found_logs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."not_found_logs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_not_found_logs_v_rels" ADD CONSTRAINT "_not_found_logs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_not_found_logs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_not_found_logs_v_rels" ADD CONSTRAINT "_not_found_logs_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_admins_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs_rels" ADD CONSTRAINT "audit_logs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs_rels" ADD CONSTRAINT "audit_logs_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_audit_logs_v" ADD CONSTRAINT "_audit_logs_v_parent_id_audit_logs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."audit_logs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_audit_logs_v" ADD CONSTRAINT "_audit_logs_v_version_user_id_admins_id_fk" FOREIGN KEY ("version_user_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_audit_logs_v_rels" ADD CONSTRAINT "_audit_logs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_audit_logs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_audit_logs_v_rels" ADD CONSTRAINT "_audit_logs_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "analytics_events_rels" ADD CONSTRAINT "analytics_events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."analytics_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "analytics_events_rels" ADD CONSTRAINT "analytics_events_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_analytics_events_v" ADD CONSTRAINT "_analytics_events_v_parent_id_analytics_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."analytics_events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_analytics_events_v" ADD CONSTRAINT "_analytics_events_v_version_lead_id_leads_id_fk" FOREIGN KEY ("version_lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_analytics_events_v_rels" ADD CONSTRAINT "_analytics_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_analytics_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_analytics_events_v_rels" ADD CONSTRAINT "_analytics_events_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_tags_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk" FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_career_paths_fk" FOREIGN KEY ("career_paths_id") REFERENCES "public"."career_paths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_posts_fk" FOREIGN KEY ("job_posts_id") REFERENCES "public"."job_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_curriculum_versions_fk" FOREIGN KEY ("curriculum_versions_id") REFERENCES "public"."curriculum_versions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faculty_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pmb_applications_fk" FOREIGN KEY ("pmb_applications_id") REFERENCES "public"."pmb_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pmb_waves_fk" FOREIGN KEY ("pmb_waves_id") REFERENCES "public"."pmb_waves"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pmb_tracks_fk" FOREIGN KEY ("pmb_tracks_id") REFERENCES "public"."pmb_tracks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_message_templates_fk" FOREIGN KEY ("message_templates_id") REFERENCES "public"."message_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pmb_documents_fk" FOREIGN KEY ("pmb_documents_id") REFERENCES "public"."pmb_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_questions_fk" FOREIGN KEY ("quiz_questions_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_results_fk" FOREIGN KEY ("quiz_results_id") REFERENCES "public"."quiz_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_attempts_fk" FOREIGN KEY ("quiz_attempts_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_roles_fk" FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_not_found_logs_fk" FOREIGN KEY ("not_found_logs_id") REFERENCES "public"."not_found_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_events_fk" FOREIGN KEY ("analytics_events_id") REFERENCES "public"."analytics_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_llm_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_llm_instructions_rels" ADD CONSTRAINT "payload_llm_instructions_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_accreditation_badge_id_media_id_fk" FOREIGN KEY ("accreditation_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_privacy_page_id_pages_id_fk" FOREIGN KEY ("privacy_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_terms_page_id_pages_id_fk" FOREIGN KEY ("terms_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_socials" ADD CONSTRAINT "_site_settings_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_accreditation_badge_id_media_id_fk" FOREIGN KEY ("version_accreditation_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_default_og_image_id_media_id_fk" FOREIGN KEY ("version_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_privacy_page_id_pages_id_fk" FOREIGN KEY ("version_privacy_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_terms_page_id_pages_id_fk" FOREIGN KEY ("version_terms_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branding_lines" ADD CONSTRAINT "branding_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branding"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_wordmark_light_id_media_id_fk" FOREIGN KEY ("wordmark_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_wordmark_dark_id_media_id_fk" FOREIGN KEY ("wordmark_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_symbol_id_media_id_fk" FOREIGN KEY ("symbol_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_og_default_id_media_id_fk" FOREIGN KEY ("og_default_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_greeting_image_id_media_id_fk" FOREIGN KEY ("poses_greeting_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_greeting_image2x_id_media_id_fk" FOREIGN KEY ("poses_greeting_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_pointing_image_id_media_id_fk" FOREIGN KEY ("poses_pointing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_pointing_image2x_id_media_id_fk" FOREIGN KEY ("poses_pointing_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_thinking_image_id_media_id_fk" FOREIGN KEY ("poses_thinking_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_thinking_image2x_id_media_id_fk" FOREIGN KEY ("poses_thinking_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_celebrating_image_id_media_id_fk" FOREIGN KEY ("poses_celebrating_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_celebrating_image2x_id_media_id_fk" FOREIGN KEY ("poses_celebrating_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_confused_image_id_media_id_fk" FOREIGN KEY ("poses_confused_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_confused_image2x_id_media_id_fk" FOREIGN KEY ("poses_confused_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_tablet_image_id_media_id_fk" FOREIGN KEY ("poses_tablet_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_poses_tablet_image2x_id_media_id_fk" FOREIGN KEY ("poses_tablet_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding" ADD CONSTRAINT "branding_glb_model_id_media_id_fk" FOREIGN KEY ("glb_model_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branding_rels" ADD CONSTRAINT "branding_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."branding"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branding_rels" ADD CONSTRAINT "branding_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_branding_v_version_lines" ADD CONSTRAINT "_branding_v_version_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_branding_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_wordmark_light_id_media_id_fk" FOREIGN KEY ("version_wordmark_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_wordmark_dark_id_media_id_fk" FOREIGN KEY ("version_wordmark_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_symbol_id_media_id_fk" FOREIGN KEY ("version_symbol_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_og_default_id_media_id_fk" FOREIGN KEY ("version_og_default_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_greeting_image_id_media_id_fk" FOREIGN KEY ("version_poses_greeting_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_greeting_image2x_id_media_id_fk" FOREIGN KEY ("version_poses_greeting_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_pointing_image_id_media_id_fk" FOREIGN KEY ("version_poses_pointing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_pointing_image2x_id_media_id_fk" FOREIGN KEY ("version_poses_pointing_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_thinking_image_id_media_id_fk" FOREIGN KEY ("version_poses_thinking_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_thinking_image2x_id_media_id_fk" FOREIGN KEY ("version_poses_thinking_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_celebrating_image_id_media_id_fk" FOREIGN KEY ("version_poses_celebrating_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_celebrating_image2x_id_media_id_fk" FOREIGN KEY ("version_poses_celebrating_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_confused_image_id_media_id_fk" FOREIGN KEY ("version_poses_confused_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_confused_image2x_id_media_id_fk" FOREIGN KEY ("version_poses_confused_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_tablet_image_id_media_id_fk" FOREIGN KEY ("version_poses_tablet_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_poses_tablet_image2x_id_media_id_fk" FOREIGN KEY ("version_poses_tablet_image2x_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v" ADD CONSTRAINT "_branding_v_version_glb_model_id_media_id_fk" FOREIGN KEY ("version_glb_model_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_branding_v_rels" ADD CONSTRAINT "_branding_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_branding_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_branding_v_rels" ADD CONSTRAINT "_branding_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_children" ADD CONSTRAINT "navigation_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mobile_bar_items" ADD CONSTRAINT "navigation_mobile_bar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_cta_brochure_file_id_media_id_fk" FOREIGN KEY ("cta_brochure_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header_children" ADD CONSTRAINT "_navigation_v_version_header_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header_children" ADD CONSTRAINT "_navigation_v_version_header_children_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header_children" ADD CONSTRAINT "_navigation_v_version_header_children_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header_children" ADD CONSTRAINT "_navigation_v_version_header_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header" ADD CONSTRAINT "_navigation_v_version_header_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header" ADD CONSTRAINT "_navigation_v_version_header_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header" ADD CONSTRAINT "_navigation_v_version_header_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_header" ADD CONSTRAINT "_navigation_v_version_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns_links" ADD CONSTRAINT "_navigation_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_footer_columns" ADD CONSTRAINT "_navigation_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_mobile_bar_items" ADD CONSTRAINT "_navigation_v_version_mobile_bar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v" ADD CONSTRAINT "_navigation_v_version_cta_brochure_file_id_media_id_fk" FOREIGN KEY ("version_cta_brochure_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_rels" ADD CONSTRAINT "_navigation_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_requirements" ADD CONSTRAINT "pmb_settings_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_fees" ADD CONSTRAINT "pmb_settings_fees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_steps" ADD CONSTRAINT "pmb_settings_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_source_options" ADD CONSTRAINT "pmb_settings_source_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pmb_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_rels" ADD CONSTRAINT "pmb_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pmb_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pmb_settings_rels" ADD CONSTRAINT "pmb_settings_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_version_requirements" ADD CONSTRAINT "_pmb_settings_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_version_fees" ADD CONSTRAINT "_pmb_settings_v_version_fees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_version_steps" ADD CONSTRAINT "_pmb_settings_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_version_source_options" ADD CONSTRAINT "_pmb_settings_v_version_source_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pmb_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_rels" ADD CONSTRAINT "_pmb_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pmb_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pmb_settings_v_rels" ADD CONSTRAINT "_pmb_settings_v_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_rotating_words_order_idx" ON "pages_blocks_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_rotating_words_parent_id_idx" ON "pages_blocks_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_orbit_chips_order_idx" ON "pages_blocks_hero_orbit_chips" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_orbit_chips_parent_id_idx" ON "pages_blocks_hero_orbit_chips" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_page_header_actions_order_idx" ON "pages_blocks_page_header_actions" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_actions_parent_id_idx" ON "pages_blocks_page_header_actions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_order_idx" ON "pages_blocks_page_header" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_header_parent_id_idx" ON "pages_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_header_path_idx" ON "pages_blocks_page_header" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_mbd_cards_order_idx" ON "pages_blocks_why_mbd_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_mbd_cards_parent_id_idx" ON "pages_blocks_why_mbd_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_mbd_order_idx" ON "pages_blocks_why_mbd" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_mbd_parent_id_idx" ON "pages_blocks_why_mbd" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_mbd_path_idx" ON "pages_blocks_why_mbd" USING btree ("_path");
  CREATE INDEX "pages_blocks_curriculum_track_order_idx" ON "pages_blocks_curriculum_track" USING btree ("_order");
  CREATE INDEX "pages_blocks_curriculum_track_parent_id_idx" ON "pages_blocks_curriculum_track" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_curriculum_track_path_idx" ON "pages_blocks_curriculum_track" USING btree ("_path");
  CREATE INDEX "pages_blocks_curriculum_explorer_order_idx" ON "pages_blocks_curriculum_explorer" USING btree ("_order");
  CREATE INDEX "pages_blocks_curriculum_explorer_parent_id_idx" ON "pages_blocks_curriculum_explorer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_curriculum_explorer_path_idx" ON "pages_blocks_curriculum_explorer" USING btree ("_path");
  CREATE INDEX "pages_blocks_faculty_highlight_order_idx" ON "pages_blocks_faculty_highlight" USING btree ("_order");
  CREATE INDEX "pages_blocks_faculty_highlight_parent_id_idx" ON "pages_blocks_faculty_highlight" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faculty_highlight_path_idx" ON "pages_blocks_faculty_highlight" USING btree ("_path");
  CREATE INDEX "pages_blocks_faculty_directory_order_idx" ON "pages_blocks_faculty_directory" USING btree ("_order");
  CREATE INDEX "pages_blocks_faculty_directory_parent_id_idx" ON "pages_blocks_faculty_directory" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faculty_directory_path_idx" ON "pages_blocks_faculty_directory" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_latest_posts_order_idx" ON "pages_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_latest_posts_parent_id_idx" ON "pages_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_posts_path_idx" ON "pages_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "pages_blocks_blog_index_order_idx" ON "pages_blocks_blog_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_index_parent_id_idx" ON "pages_blocks_blog_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_index_path_idx" ON "pages_blocks_blog_index" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_marquee_words_order_idx" ON "pages_blocks_marquee_words" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_words_parent_id_idx" ON "pages_blocks_marquee_words" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_order_idx" ON "pages_blocks_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_marquee_parent_id_idx" ON "pages_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marquee_path_idx" ON "pages_blocks_marquee" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_embed_order_idx" ON "pages_blocks_form_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_embed_parent_id_idx" ON "pages_blocks_form_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_embed_path_idx" ON "pages_blocks_form_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_programs_order_idx" ON "pages_blocks_programs" USING btree ("_order");
  CREATE INDEX "pages_blocks_programs_parent_id_idx" ON "pages_blocks_programs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_programs_path_idx" ON "pages_blocks_programs" USING btree ("_path");
  CREATE INDEX "pages_blocks_career_paths_order_idx" ON "pages_blocks_career_paths" USING btree ("_order");
  CREATE INDEX "pages_blocks_career_paths_parent_id_idx" ON "pages_blocks_career_paths" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_career_paths_path_idx" ON "pages_blocks_career_paths" USING btree ("_path");
  CREATE INDEX "pages_blocks_job_board_order_idx" ON "pages_blocks_job_board" USING btree ("_order");
  CREATE INDEX "pages_blocks_job_board_parent_id_idx" ON "pages_blocks_job_board" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_job_board_path_idx" ON "pages_blocks_job_board" USING btree ("_path");
  CREATE INDEX "pages_blocks_pmb_info_order_idx" ON "pages_blocks_pmb_info" USING btree ("_order");
  CREATE INDEX "pages_blocks_pmb_info_parent_id_idx" ON "pages_blocks_pmb_info" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pmb_info_path_idx" ON "pages_blocks_pmb_info" USING btree ("_path");
  CREATE INDEX "pages_blocks_quiz_bands_order_idx" ON "pages_blocks_quiz_bands" USING btree ("_order");
  CREATE INDEX "pages_blocks_quiz_bands_parent_id_idx" ON "pages_blocks_quiz_bands" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quiz_order_idx" ON "pages_blocks_quiz" USING btree ("_order");
  CREATE INDEX "pages_blocks_quiz_parent_id_idx" ON "pages_blocks_quiz" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quiz_path_idx" ON "pages_blocks_quiz" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_info_order_idx" ON "pages_blocks_contact_info" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_info_parent_id_idx" ON "pages_blocks_contact_info" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_info_path_idx" ON "pages_blocks_contact_info" USING btree ("_path");
  CREATE INDEX "pages_blocks_not_found_hero_quick_links_order_idx" ON "pages_blocks_not_found_hero_quick_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_not_found_hero_quick_links_parent_id_idx" ON "pages_blocks_not_found_hero_quick_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_not_found_hero_order_idx" ON "pages_blocks_not_found_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_not_found_hero_parent_id_idx" ON "pages_blocks_not_found_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_not_found_hero_path_idx" ON "pages_blocks_not_found_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_review_status_idx" ON "pages" USING btree ("review_status");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "pages__status_idx" ON "pages_locales" USING btree ("_status","_locale");
  CREATE UNIQUE INDEX "pages_locales_parent_id_locale_unique" ON "pages_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_admins_id_idx" ON "pages_rels" USING btree ("admins_id");
  CREATE INDEX "_pages_v_blocks_hero_rotating_words_order_idx" ON "_pages_v_blocks_hero_rotating_words" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_rotating_words_parent_id_idx" ON "_pages_v_blocks_hero_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_orbit_chips_order_idx" ON "_pages_v_blocks_hero_orbit_chips" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_orbit_chips_parent_id_idx" ON "_pages_v_blocks_hero_orbit_chips" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_header_actions_order_idx" ON "_pages_v_blocks_page_header_actions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_actions_parent_id_idx" ON "_pages_v_blocks_page_header_actions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_order_idx" ON "_pages_v_blocks_page_header" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_header_parent_id_idx" ON "_pages_v_blocks_page_header" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_header_path_idx" ON "_pages_v_blocks_page_header" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_why_mbd_cards_order_idx" ON "_pages_v_blocks_why_mbd_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_mbd_cards_parent_id_idx" ON "_pages_v_blocks_why_mbd_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_mbd_order_idx" ON "_pages_v_blocks_why_mbd" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_mbd_parent_id_idx" ON "_pages_v_blocks_why_mbd" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_mbd_path_idx" ON "_pages_v_blocks_why_mbd" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_curriculum_track_order_idx" ON "_pages_v_blocks_curriculum_track" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_curriculum_track_parent_id_idx" ON "_pages_v_blocks_curriculum_track" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_curriculum_track_path_idx" ON "_pages_v_blocks_curriculum_track" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_curriculum_explorer_order_idx" ON "_pages_v_blocks_curriculum_explorer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_curriculum_explorer_parent_id_idx" ON "_pages_v_blocks_curriculum_explorer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_curriculum_explorer_path_idx" ON "_pages_v_blocks_curriculum_explorer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faculty_highlight_order_idx" ON "_pages_v_blocks_faculty_highlight" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faculty_highlight_parent_id_idx" ON "_pages_v_blocks_faculty_highlight" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faculty_highlight_path_idx" ON "_pages_v_blocks_faculty_highlight" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faculty_directory_order_idx" ON "_pages_v_blocks_faculty_directory" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faculty_directory_parent_id_idx" ON "_pages_v_blocks_faculty_directory" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faculty_directory_path_idx" ON "_pages_v_blocks_faculty_directory" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_latest_posts_order_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_latest_posts_parent_id_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_posts_path_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_blog_index_order_idx" ON "_pages_v_blocks_blog_index" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blog_index_parent_id_idx" ON "_pages_v_blocks_blog_index" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blog_index_path_idx" ON "_pages_v_blocks_blog_index" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_marquee_words_order_idx" ON "_pages_v_blocks_marquee_words" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_words_parent_id_idx" ON "_pages_v_blocks_marquee_words" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_order_idx" ON "_pages_v_blocks_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marquee_parent_id_idx" ON "_pages_v_blocks_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marquee_path_idx" ON "_pages_v_blocks_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_embed_order_idx" ON "_pages_v_blocks_form_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_embed_parent_id_idx" ON "_pages_v_blocks_form_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_embed_path_idx" ON "_pages_v_blocks_form_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_programs_order_idx" ON "_pages_v_blocks_programs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_programs_parent_id_idx" ON "_pages_v_blocks_programs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_programs_path_idx" ON "_pages_v_blocks_programs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_career_paths_order_idx" ON "_pages_v_blocks_career_paths" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_career_paths_parent_id_idx" ON "_pages_v_blocks_career_paths" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_career_paths_path_idx" ON "_pages_v_blocks_career_paths" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_job_board_order_idx" ON "_pages_v_blocks_job_board" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_job_board_parent_id_idx" ON "_pages_v_blocks_job_board" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_job_board_path_idx" ON "_pages_v_blocks_job_board" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pmb_info_order_idx" ON "_pages_v_blocks_pmb_info" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pmb_info_parent_id_idx" ON "_pages_v_blocks_pmb_info" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pmb_info_path_idx" ON "_pages_v_blocks_pmb_info" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quiz_bands_order_idx" ON "_pages_v_blocks_quiz_bands" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quiz_bands_parent_id_idx" ON "_pages_v_blocks_quiz_bands" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quiz_order_idx" ON "_pages_v_blocks_quiz" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quiz_parent_id_idx" ON "_pages_v_blocks_quiz" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quiz_path_idx" ON "_pages_v_blocks_quiz" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_info_order_idx" ON "_pages_v_blocks_contact_info" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_info_parent_id_idx" ON "_pages_v_blocks_contact_info" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_info_path_idx" ON "_pages_v_blocks_contact_info" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_not_found_hero_quick_links_order_idx" ON "_pages_v_blocks_not_found_hero_quick_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_not_found_hero_quick_links_parent_id_idx" ON "_pages_v_blocks_not_found_hero_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_not_found_hero_order_idx" ON "_pages_v_blocks_not_found_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_not_found_hero_parent_id_idx" ON "_pages_v_blocks_not_found_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_not_found_hero_path_idx" ON "_pages_v_blocks_not_found_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_review_status_idx" ON "_pages_v" USING btree ("version_review_status");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v_locales" USING btree ("version__status","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_parent_id_locale_unique" ON "_pages_v_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_admins_id_idx" ON "_pages_v_rels" USING btree ("admins_id");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_featured_idx" ON "posts" USING btree ("featured");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_review_status_idx" ON "posts" USING btree ("review_status");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "posts__status_idx" ON "posts_locales" USING btree ("_status","_locale");
  CREATE UNIQUE INDEX "posts_locales_parent_id_locale_unique" ON "posts_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_post_tags_id_idx" ON "posts_rels" USING btree ("post_tags_id");
  CREATE INDEX "posts_rels_admins_id_idx" ON "posts_rels" USING btree ("admins_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_featured_idx" ON "_posts_v" USING btree ("version_featured");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_review_status_idx" ON "_posts_v" USING btree ("version_review_status");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version_deleted_at_idx" ON "_posts_v" USING btree ("version_deleted_at");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v_locales" USING btree ("version__status","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_parent_id_locale_unique" ON "_posts_v_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_post_tags_id_idx" ON "_posts_v_rels" USING btree ("post_tags_id");
  CREATE INDEX "_posts_v_rels_admins_id_idx" ON "_posts_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
  CREATE INDEX "post_categories_sort_order_idx" ON "post_categories" USING btree ("sort_order");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE INDEX "post_categories_rels_order_idx" ON "post_categories_rels" USING btree ("order");
  CREATE INDEX "post_categories_rels_parent_idx" ON "post_categories_rels" USING btree ("parent_id");
  CREATE INDEX "post_categories_rels_path_idx" ON "post_categories_rels" USING btree ("path");
  CREATE INDEX "post_categories_rels_admins_id_idx" ON "post_categories_rels" USING btree ("admins_id");
  CREATE INDEX "_post_categories_v_parent_idx" ON "_post_categories_v" USING btree ("parent_id");
  CREATE INDEX "_post_categories_v_version_version_slug_idx" ON "_post_categories_v" USING btree ("version_slug");
  CREATE INDEX "_post_categories_v_version_version_sort_order_idx" ON "_post_categories_v" USING btree ("version_sort_order");
  CREATE INDEX "_post_categories_v_version_version_updated_at_idx" ON "_post_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_post_categories_v_version_version_created_at_idx" ON "_post_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_post_categories_v_created_at_idx" ON "_post_categories_v" USING btree ("created_at");
  CREATE INDEX "_post_categories_v_updated_at_idx" ON "_post_categories_v" USING btree ("updated_at");
  CREATE INDEX "_post_categories_v_rels_order_idx" ON "_post_categories_v_rels" USING btree ("order");
  CREATE INDEX "_post_categories_v_rels_parent_idx" ON "_post_categories_v_rels" USING btree ("parent_id");
  CREATE INDEX "_post_categories_v_rels_path_idx" ON "_post_categories_v_rels" USING btree ("path");
  CREATE INDEX "_post_categories_v_rels_admins_id_idx" ON "_post_categories_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "post_tags_slug_idx" ON "post_tags" USING btree ("slug");
  CREATE INDEX "post_tags_updated_at_idx" ON "post_tags" USING btree ("updated_at");
  CREATE INDEX "post_tags_created_at_idx" ON "post_tags" USING btree ("created_at");
  CREATE INDEX "post_tags_rels_order_idx" ON "post_tags_rels" USING btree ("order");
  CREATE INDEX "post_tags_rels_parent_idx" ON "post_tags_rels" USING btree ("parent_id");
  CREATE INDEX "post_tags_rels_path_idx" ON "post_tags_rels" USING btree ("path");
  CREATE INDEX "post_tags_rels_admins_id_idx" ON "post_tags_rels" USING btree ("admins_id");
  CREATE INDEX "_post_tags_v_parent_idx" ON "_post_tags_v" USING btree ("parent_id");
  CREATE INDEX "_post_tags_v_version_version_slug_idx" ON "_post_tags_v" USING btree ("version_slug");
  CREATE INDEX "_post_tags_v_version_version_updated_at_idx" ON "_post_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_post_tags_v_version_version_created_at_idx" ON "_post_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_post_tags_v_created_at_idx" ON "_post_tags_v" USING btree ("created_at");
  CREATE INDEX "_post_tags_v_updated_at_idx" ON "_post_tags_v" USING btree ("updated_at");
  CREATE INDEX "_post_tags_v_rels_order_idx" ON "_post_tags_v_rels" USING btree ("order");
  CREATE INDEX "_post_tags_v_rels_parent_idx" ON "_post_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_post_tags_v_rels_path_idx" ON "_post_tags_v_rels" USING btree ("path");
  CREATE INDEX "_post_tags_v_rels_admins_id_idx" ON "_post_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "media__h_folders_idx" ON "media" USING btree ("_h_folders_id");
  CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_original_original_filename_idx" ON "media" USING btree ("original_filename");
  CREATE INDEX "media_rels_order_idx" ON "media_rels" USING btree ("order");
  CREATE INDEX "media_rels_parent_idx" ON "media_rels" USING btree ("parent_id");
  CREATE INDEX "media_rels_path_idx" ON "media_rels" USING btree ("path");
  CREATE INDEX "media_rels_tags_id_idx" ON "media_rels" USING btree ("tags_id");
  CREATE INDEX "media_rels_admins_id_idx" ON "media_rels" USING btree ("admins_id");
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version__h_folders_idx" ON "_media_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_media_v_version_version_uploaded_by_idx" ON "_media_v" USING btree ("version_uploaded_by_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_original_version_original_filename_idx" ON "_media_v" USING btree ("version_original_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_media_v_rels_order_idx" ON "_media_v_rels" USING btree ("order");
  CREATE INDEX "_media_v_rels_parent_idx" ON "_media_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_v_rels_path_idx" ON "_media_v_rels" USING btree ("path");
  CREATE INDEX "_media_v_rels_tags_id_idx" ON "_media_v_rels" USING btree ("tags_id");
  CREATE INDEX "_media_v_rels_admins_id_idx" ON "_media_v_rels" USING btree ("admins_id");
  CREATE INDEX "folders__h_folders_idx" ON "folders" USING btree ("_h_folders_id");
  CREATE INDEX "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
  CREATE INDEX "folders_created_at_idx" ON "folders" USING btree ("created_at");
  CREATE INDEX "folders_rels_order_idx" ON "folders_rels" USING btree ("order");
  CREATE INDEX "folders_rels_parent_idx" ON "folders_rels" USING btree ("parent_id");
  CREATE INDEX "folders_rels_path_idx" ON "folders_rels" USING btree ("path");
  CREATE INDEX "folders_rels_admins_id_idx" ON "folders_rels" USING btree ("admins_id");
  CREATE INDEX "_folders_v_parent_idx" ON "_folders_v" USING btree ("parent_id");
  CREATE INDEX "_folders_v_version_version__h_folders_idx" ON "_folders_v" USING btree ("version__h_folders_id");
  CREATE INDEX "_folders_v_version_version_updated_at_idx" ON "_folders_v" USING btree ("version_updated_at");
  CREATE INDEX "_folders_v_version_version_created_at_idx" ON "_folders_v" USING btree ("version_created_at");
  CREATE INDEX "_folders_v_created_at_idx" ON "_folders_v" USING btree ("created_at");
  CREATE INDEX "_folders_v_updated_at_idx" ON "_folders_v" USING btree ("updated_at");
  CREATE INDEX "_folders_v_rels_order_idx" ON "_folders_v_rels" USING btree ("order");
  CREATE INDEX "_folders_v_rels_parent_idx" ON "_folders_v_rels" USING btree ("parent_id");
  CREATE INDEX "_folders_v_rels_path_idx" ON "_folders_v_rels" USING btree ("path");
  CREATE INDEX "_folders_v_rels_admins_id_idx" ON "_folders_v_rels" USING btree ("admins_id");
  CREATE INDEX "tags__h_tags_idx" ON "tags" USING btree ("_h_tags_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "tags_rels_order_idx" ON "tags_rels" USING btree ("order");
  CREATE INDEX "tags_rels_parent_idx" ON "tags_rels" USING btree ("parent_id");
  CREATE INDEX "tags_rels_path_idx" ON "tags_rels" USING btree ("path");
  CREATE INDEX "tags_rels_admins_id_idx" ON "tags_rels" USING btree ("admins_id");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version__h_tags_idx" ON "_tags_v" USING btree ("version__h_tags_id");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_rels_order_idx" ON "_tags_v_rels" USING btree ("order");
  CREATE INDEX "_tags_v_rels_parent_idx" ON "_tags_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tags_v_rels_path_idx" ON "_tags_v_rels" USING btree ("path");
  CREATE INDEX "_tags_v_rels_admins_id_idx" ON "_tags_v_rels" USING btree ("admins_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_approved_idx" ON "testimonials" USING btree ("approved");
  CREATE INDEX "testimonials_sort_order_idx" ON "testimonials" USING btree ("sort_order");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials_rels_order_idx" ON "testimonials_rels" USING btree ("order");
  CREATE INDEX "testimonials_rels_parent_idx" ON "testimonials_rels" USING btree ("parent_id");
  CREATE INDEX "testimonials_rels_path_idx" ON "testimonials_rels" USING btree ("path");
  CREATE INDEX "testimonials_rels_admins_id_idx" ON "testimonials_rels" USING btree ("admins_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_photo_idx" ON "_testimonials_v" USING btree ("version_photo_id");
  CREATE INDEX "_testimonials_v_version_version_approved_idx" ON "_testimonials_v" USING btree ("version_approved");
  CREATE INDEX "_testimonials_v_version_version_sort_order_idx" ON "_testimonials_v" USING btree ("version_sort_order");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_rels_order_idx" ON "_testimonials_v_rels" USING btree ("order");
  CREATE INDEX "_testimonials_v_rels_parent_idx" ON "_testimonials_v_rels" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_rels_path_idx" ON "_testimonials_v_rels" USING btree ("path");
  CREATE INDEX "_testimonials_v_rels_admins_id_idx" ON "_testimonials_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "career_paths_slug_idx" ON "career_paths" USING btree ("slug");
  CREATE INDEX "career_paths_is_active_idx" ON "career_paths" USING btree ("is_active");
  CREATE INDEX "career_paths_sort_order_idx" ON "career_paths" USING btree ("sort_order");
  CREATE INDEX "career_paths_updated_at_idx" ON "career_paths" USING btree ("updated_at");
  CREATE INDEX "career_paths_created_at_idx" ON "career_paths" USING btree ("created_at");
  CREATE INDEX "career_paths_texts_order_parent" ON "career_paths_texts" USING btree ("order","parent_id");
  CREATE INDEX "career_paths_rels_order_idx" ON "career_paths_rels" USING btree ("order");
  CREATE INDEX "career_paths_rels_parent_idx" ON "career_paths_rels" USING btree ("parent_id");
  CREATE INDEX "career_paths_rels_path_idx" ON "career_paths_rels" USING btree ("path");
  CREATE INDEX "career_paths_rels_courses_id_idx" ON "career_paths_rels" USING btree ("courses_id");
  CREATE INDEX "career_paths_rels_admins_id_idx" ON "career_paths_rels" USING btree ("admins_id");
  CREATE INDEX "_career_paths_v_parent_idx" ON "_career_paths_v" USING btree ("parent_id");
  CREATE INDEX "_career_paths_v_version_version_slug_idx" ON "_career_paths_v" USING btree ("version_slug");
  CREATE INDEX "_career_paths_v_version_version_is_active_idx" ON "_career_paths_v" USING btree ("version_is_active");
  CREATE INDEX "_career_paths_v_version_version_sort_order_idx" ON "_career_paths_v" USING btree ("version_sort_order");
  CREATE INDEX "_career_paths_v_version_version_updated_at_idx" ON "_career_paths_v" USING btree ("version_updated_at");
  CREATE INDEX "_career_paths_v_version_version_created_at_idx" ON "_career_paths_v" USING btree ("version_created_at");
  CREATE INDEX "_career_paths_v_created_at_idx" ON "_career_paths_v" USING btree ("created_at");
  CREATE INDEX "_career_paths_v_updated_at_idx" ON "_career_paths_v" USING btree ("updated_at");
  CREATE INDEX "_career_paths_v_texts_order_parent" ON "_career_paths_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_career_paths_v_rels_order_idx" ON "_career_paths_v_rels" USING btree ("order");
  CREATE INDEX "_career_paths_v_rels_parent_idx" ON "_career_paths_v_rels" USING btree ("parent_id");
  CREATE INDEX "_career_paths_v_rels_path_idx" ON "_career_paths_v_rels" USING btree ("path");
  CREATE INDEX "_career_paths_v_rels_courses_id_idx" ON "_career_paths_v_rels" USING btree ("courses_id");
  CREATE INDEX "_career_paths_v_rels_admins_id_idx" ON "_career_paths_v_rels" USING btree ("admins_id");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_is_active_idx" ON "partners" USING btree ("is_active");
  CREATE INDEX "partners_sort_order_idx" ON "partners" USING btree ("sort_order");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners_rels_order_idx" ON "partners_rels" USING btree ("order");
  CREATE INDEX "partners_rels_parent_idx" ON "partners_rels" USING btree ("parent_id");
  CREATE INDEX "partners_rels_path_idx" ON "partners_rels" USING btree ("path");
  CREATE INDEX "partners_rels_admins_id_idx" ON "partners_rels" USING btree ("admins_id");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_is_active_idx" ON "_partners_v" USING btree ("version_is_active");
  CREATE INDEX "_partners_v_version_version_sort_order_idx" ON "_partners_v" USING btree ("version_sort_order");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_rels_order_idx" ON "_partners_v_rels" USING btree ("order");
  CREATE INDEX "_partners_v_rels_parent_idx" ON "_partners_v_rels" USING btree ("parent_id");
  CREATE INDEX "_partners_v_rels_path_idx" ON "_partners_v_rels" USING btree ("path");
  CREATE INDEX "_partners_v_rels_admins_id_idx" ON "_partners_v_rels" USING btree ("admins_id");
  CREATE INDEX "programs_image_idx" ON "programs" USING btree ("image_id");
  CREATE INDEX "programs_is_active_idx" ON "programs" USING btree ("is_active");
  CREATE INDEX "programs_sort_order_idx" ON "programs" USING btree ("sort_order");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs_rels_order_idx" ON "programs_rels" USING btree ("order");
  CREATE INDEX "programs_rels_parent_idx" ON "programs_rels" USING btree ("parent_id");
  CREATE INDEX "programs_rels_path_idx" ON "programs_rels" USING btree ("path");
  CREATE INDEX "programs_rels_admins_id_idx" ON "programs_rels" USING btree ("admins_id");
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version_image_idx" ON "_programs_v" USING btree ("version_image_id");
  CREATE INDEX "_programs_v_version_version_is_active_idx" ON "_programs_v" USING btree ("version_is_active");
  CREATE INDEX "_programs_v_version_version_sort_order_idx" ON "_programs_v" USING btree ("version_sort_order");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_rels_order_idx" ON "_programs_v_rels" USING btree ("order");
  CREATE INDEX "_programs_v_rels_parent_idx" ON "_programs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_programs_v_rels_path_idx" ON "_programs_v_rels" USING btree ("path");
  CREATE INDEX "_programs_v_rels_admins_id_idx" ON "_programs_v_rels" USING btree ("admins_id");
  CREATE INDEX "job_posts_deadline_idx" ON "job_posts" USING btree ("deadline");
  CREATE INDEX "job_posts_is_active_idx" ON "job_posts" USING btree ("is_active");
  CREATE INDEX "job_posts_updated_at_idx" ON "job_posts" USING btree ("updated_at");
  CREATE INDEX "job_posts_created_at_idx" ON "job_posts" USING btree ("created_at");
  CREATE INDEX "job_posts_rels_order_idx" ON "job_posts_rels" USING btree ("order");
  CREATE INDEX "job_posts_rels_parent_idx" ON "job_posts_rels" USING btree ("parent_id");
  CREATE INDEX "job_posts_rels_path_idx" ON "job_posts_rels" USING btree ("path");
  CREATE INDEX "job_posts_rels_admins_id_idx" ON "job_posts_rels" USING btree ("admins_id");
  CREATE INDEX "_job_posts_v_parent_idx" ON "_job_posts_v" USING btree ("parent_id");
  CREATE INDEX "_job_posts_v_version_version_deadline_idx" ON "_job_posts_v" USING btree ("version_deadline");
  CREATE INDEX "_job_posts_v_version_version_is_active_idx" ON "_job_posts_v" USING btree ("version_is_active");
  CREATE INDEX "_job_posts_v_version_version_updated_at_idx" ON "_job_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_job_posts_v_version_version_created_at_idx" ON "_job_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_job_posts_v_created_at_idx" ON "_job_posts_v" USING btree ("created_at");
  CREATE INDEX "_job_posts_v_updated_at_idx" ON "_job_posts_v" USING btree ("updated_at");
  CREATE INDEX "_job_posts_v_rels_order_idx" ON "_job_posts_v_rels" USING btree ("order");
  CREATE INDEX "_job_posts_v_rels_parent_idx" ON "_job_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_job_posts_v_rels_path_idx" ON "_job_posts_v_rels" USING btree ("path");
  CREATE INDEX "_job_posts_v_rels_admins_id_idx" ON "_job_posts_v_rels" USING btree ("admins_id");
  CREATE INDEX "faqs_scope_order_idx" ON "faqs_scope" USING btree ("order");
  CREATE INDEX "faqs_scope_parent_idx" ON "faqs_scope" USING btree ("parent_id");
  CREATE INDEX "faqs_scope_value_idx" ON "faqs_scope" USING btree ("value");
  CREATE INDEX "faqs_is_active_idx" ON "faqs" USING btree ("is_active");
  CREATE INDEX "faqs_sort_order_idx" ON "faqs" USING btree ("sort_order");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs_rels_order_idx" ON "faqs_rels" USING btree ("order");
  CREATE INDEX "faqs_rels_parent_idx" ON "faqs_rels" USING btree ("parent_id");
  CREATE INDEX "faqs_rels_path_idx" ON "faqs_rels" USING btree ("path");
  CREATE INDEX "faqs_rels_admins_id_idx" ON "faqs_rels" USING btree ("admins_id");
  CREATE INDEX "_faqs_v_version_scope_order_idx" ON "_faqs_v_version_scope" USING btree ("order");
  CREATE INDEX "_faqs_v_version_scope_parent_idx" ON "_faqs_v_version_scope" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_scope_value_idx" ON "_faqs_v_version_scope" USING btree ("value");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_is_active_idx" ON "_faqs_v" USING btree ("version_is_active");
  CREATE INDEX "_faqs_v_version_version_sort_order_idx" ON "_faqs_v" USING btree ("version_sort_order");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_rels_order_idx" ON "_faqs_v_rels" USING btree ("order");
  CREATE INDEX "_faqs_v_rels_parent_idx" ON "_faqs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_rels_path_idx" ON "_faqs_v_rels" USING btree ("path");
  CREATE INDEX "_faqs_v_rels_admins_id_idx" ON "_faqs_v_rels" USING btree ("admins_id");
  CREATE INDEX "curriculum_versions_semesters_order_idx" ON "curriculum_versions_semesters" USING btree ("_order");
  CREATE INDEX "curriculum_versions_semesters_parent_id_idx" ON "curriculum_versions_semesters" USING btree ("_parent_id");
  CREATE INDEX "curriculum_versions_is_active_idx" ON "curriculum_versions" USING btree ("is_active");
  CREATE INDEX "curriculum_versions_pdf_idx" ON "curriculum_versions" USING btree ("pdf_id");
  CREATE INDEX "curriculum_versions_updated_at_idx" ON "curriculum_versions" USING btree ("updated_at");
  CREATE INDEX "curriculum_versions_created_at_idx" ON "curriculum_versions" USING btree ("created_at");
  CREATE INDEX "curriculum_versions_rels_order_idx" ON "curriculum_versions_rels" USING btree ("order");
  CREATE INDEX "curriculum_versions_rels_parent_idx" ON "curriculum_versions_rels" USING btree ("parent_id");
  CREATE INDEX "curriculum_versions_rels_path_idx" ON "curriculum_versions_rels" USING btree ("path");
  CREATE INDEX "curriculum_versions_rels_admins_id_idx" ON "curriculum_versions_rels" USING btree ("admins_id");
  CREATE INDEX "_curriculum_versions_v_version_semesters_order_idx" ON "_curriculum_versions_v_version_semesters" USING btree ("_order");
  CREATE INDEX "_curriculum_versions_v_version_semesters_parent_id_idx" ON "_curriculum_versions_v_version_semesters" USING btree ("_parent_id");
  CREATE INDEX "_curriculum_versions_v_parent_idx" ON "_curriculum_versions_v" USING btree ("parent_id");
  CREATE INDEX "_curriculum_versions_v_version_version_is_active_idx" ON "_curriculum_versions_v" USING btree ("version_is_active");
  CREATE INDEX "_curriculum_versions_v_version_version_pdf_idx" ON "_curriculum_versions_v" USING btree ("version_pdf_id");
  CREATE INDEX "_curriculum_versions_v_version_version_updated_at_idx" ON "_curriculum_versions_v" USING btree ("version_updated_at");
  CREATE INDEX "_curriculum_versions_v_version_version_created_at_idx" ON "_curriculum_versions_v" USING btree ("version_created_at");
  CREATE INDEX "_curriculum_versions_v_created_at_idx" ON "_curriculum_versions_v" USING btree ("created_at");
  CREATE INDEX "_curriculum_versions_v_updated_at_idx" ON "_curriculum_versions_v" USING btree ("updated_at");
  CREATE INDEX "_curriculum_versions_v_rels_order_idx" ON "_curriculum_versions_v_rels" USING btree ("order");
  CREATE INDEX "_curriculum_versions_v_rels_parent_idx" ON "_curriculum_versions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_curriculum_versions_v_rels_path_idx" ON "_curriculum_versions_v_rels" USING btree ("path");
  CREATE INDEX "_curriculum_versions_v_rels_admins_id_idx" ON "_curriculum_versions_v_rels" USING btree ("admins_id");
  CREATE INDEX "courses_tags_order_idx" ON "courses_tags" USING btree ("order");
  CREATE INDEX "courses_tags_parent_idx" ON "courses_tags" USING btree ("parent_id");
  CREATE INDEX "courses_tags_value_idx" ON "courses_tags" USING btree ("value");
  CREATE INDEX "courses_cpmk_order_idx" ON "courses_cpmk" USING btree ("_order");
  CREATE INDEX "courses_cpmk_parent_id_idx" ON "courses_cpmk" USING btree ("_parent_id");
  CREATE INDEX "courses_weekly_plan_order_idx" ON "courses_weekly_plan" USING btree ("_order");
  CREATE INDEX "courses_weekly_plan_parent_id_idx" ON "courses_weekly_plan" USING btree ("_parent_id");
  CREATE INDEX "courses_assessment_order_idx" ON "courses_assessment" USING btree ("_order");
  CREATE INDEX "courses_assessment_parent_id_idx" ON "courses_assessment" USING btree ("_parent_id");
  CREATE INDEX "courses_references_order_idx" ON "courses_references" USING btree ("_order");
  CREATE INDEX "courses_references_parent_id_idx" ON "courses_references" USING btree ("_parent_id");
  CREATE INDEX "courses_tools_order_idx" ON "courses_tools" USING btree ("_order");
  CREATE INDEX "courses_tools_parent_id_idx" ON "courses_tools" USING btree ("_parent_id");
  CREATE INDEX "courses_code_idx" ON "courses" USING btree ("code");
  CREATE INDEX "courses_semester_idx" ON "courses" USING btree ("semester");
  CREATE INDEX "courses_rps_idx" ON "courses" USING btree ("rps_id");
  CREATE INDEX "courses_version_idx" ON "courses" USING btree ("version_id");
  CREATE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_is_visible_idx" ON "courses" USING btree ("is_visible");
  CREATE INDEX "courses_syllabus_completeness_idx" ON "courses" USING btree ("syllabus_completeness");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses_deleted_at_idx" ON "courses" USING btree ("deleted_at");
  CREATE UNIQUE INDEX "version_code_idx" ON "courses" USING btree ("version_id","code");
  CREATE INDEX "courses_meta_meta_image_idx" ON "courses_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "courses_locales_parent_id_locale_unique" ON "courses_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX "courses_rels_courses_id_idx" ON "courses_rels" USING btree ("courses_id");
  CREATE INDEX "courses_rels_faculty_id_idx" ON "courses_rels" USING btree ("faculty_id");
  CREATE INDEX "courses_rels_admins_id_idx" ON "courses_rels" USING btree ("admins_id");
  CREATE INDEX "_courses_v_version_tags_order_idx" ON "_courses_v_version_tags" USING btree ("order");
  CREATE INDEX "_courses_v_version_tags_parent_idx" ON "_courses_v_version_tags" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_tags_value_idx" ON "_courses_v_version_tags" USING btree ("value");
  CREATE INDEX "_courses_v_version_cpmk_order_idx" ON "_courses_v_version_cpmk" USING btree ("_order");
  CREATE INDEX "_courses_v_version_cpmk_parent_id_idx" ON "_courses_v_version_cpmk" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_weekly_plan_order_idx" ON "_courses_v_version_weekly_plan" USING btree ("_order");
  CREATE INDEX "_courses_v_version_weekly_plan_parent_id_idx" ON "_courses_v_version_weekly_plan" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_assessment_order_idx" ON "_courses_v_version_assessment" USING btree ("_order");
  CREATE INDEX "_courses_v_version_assessment_parent_id_idx" ON "_courses_v_version_assessment" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_references_order_idx" ON "_courses_v_version_references" USING btree ("_order");
  CREATE INDEX "_courses_v_version_references_parent_id_idx" ON "_courses_v_version_references" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_tools_order_idx" ON "_courses_v_version_tools" USING btree ("_order");
  CREATE INDEX "_courses_v_version_tools_parent_id_idx" ON "_courses_v_version_tools" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_code_idx" ON "_courses_v" USING btree ("version_code");
  CREATE INDEX "_courses_v_version_version_semester_idx" ON "_courses_v" USING btree ("version_semester");
  CREATE INDEX "_courses_v_version_version_rps_idx" ON "_courses_v" USING btree ("version_rps_id");
  CREATE INDEX "_courses_v_version_version_version_idx" ON "_courses_v" USING btree ("version_version_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_is_visible_idx" ON "_courses_v" USING btree ("version_is_visible");
  CREATE INDEX "_courses_v_version_version_syllabus_completeness_idx" ON "_courses_v" USING btree ("version_syllabus_completeness");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version_deleted_at_idx" ON "_courses_v" USING btree ("version_deleted_at");
  CREATE INDEX "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX "version_version_version_code_idx" ON "_courses_v" USING btree ("version_version_id","version_code");
  CREATE INDEX "_courses_v_version_meta_version_meta_image_idx" ON "_courses_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_courses_v_locales_parent_id_locale_unique" ON "_courses_v_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "_courses_v_rels_order_idx" ON "_courses_v_rels" USING btree ("order");
  CREATE INDEX "_courses_v_rels_parent_idx" ON "_courses_v_rels" USING btree ("parent_id");
  CREATE INDEX "_courses_v_rels_path_idx" ON "_courses_v_rels" USING btree ("path");
  CREATE INDEX "_courses_v_rels_courses_id_idx" ON "_courses_v_rels" USING btree ("courses_id");
  CREATE INDEX "_courses_v_rels_faculty_id_idx" ON "_courses_v_rels" USING btree ("faculty_id");
  CREATE INDEX "_courses_v_rels_admins_id_idx" ON "_courses_v_rels" USING btree ("admins_id");
  CREATE INDEX "faculty_education_order_idx" ON "faculty_education" USING btree ("_order");
  CREATE INDEX "faculty_education_parent_id_idx" ON "faculty_education" USING btree ("_parent_id");
  CREATE INDEX "faculty_publications_order_idx" ON "faculty_publications" USING btree ("_order");
  CREATE INDEX "faculty_publications_parent_id_idx" ON "faculty_publications" USING btree ("_parent_id");
  CREATE INDEX "faculty_photo_idx" ON "faculty" USING btree ("photo_id");
  CREATE UNIQUE INDEX "faculty_slug_idx" ON "faculty" USING btree ("slug");
  CREATE INDEX "faculty_show_on_home_idx" ON "faculty" USING btree ("show_on_home");
  CREATE INDEX "faculty_sort_order_idx" ON "faculty" USING btree ("sort_order");
  CREATE INDEX "faculty_updated_at_idx" ON "faculty" USING btree ("updated_at");
  CREATE INDEX "faculty_created_at_idx" ON "faculty" USING btree ("created_at");
  CREATE INDEX "faculty_deleted_at_idx" ON "faculty" USING btree ("deleted_at");
  CREATE INDEX "faculty_meta_meta_image_idx" ON "faculty_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "faculty__status_idx" ON "faculty_locales" USING btree ("_status","_locale");
  CREATE UNIQUE INDEX "faculty_locales_parent_id_locale_unique" ON "faculty_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "faculty_texts_order_parent" ON "faculty_texts" USING btree ("order","parent_id");
  CREATE INDEX "faculty_rels_order_idx" ON "faculty_rels" USING btree ("order");
  CREATE INDEX "faculty_rels_parent_idx" ON "faculty_rels" USING btree ("parent_id");
  CREATE INDEX "faculty_rels_path_idx" ON "faculty_rels" USING btree ("path");
  CREATE INDEX "faculty_rels_admins_id_idx" ON "faculty_rels" USING btree ("admins_id");
  CREATE INDEX "_faculty_v_version_education_order_idx" ON "_faculty_v_version_education" USING btree ("_order");
  CREATE INDEX "_faculty_v_version_education_parent_id_idx" ON "_faculty_v_version_education" USING btree ("_parent_id");
  CREATE INDEX "_faculty_v_version_publications_order_idx" ON "_faculty_v_version_publications" USING btree ("_order");
  CREATE INDEX "_faculty_v_version_publications_parent_id_idx" ON "_faculty_v_version_publications" USING btree ("_parent_id");
  CREATE INDEX "_faculty_v_parent_idx" ON "_faculty_v" USING btree ("parent_id");
  CREATE INDEX "_faculty_v_version_version_photo_idx" ON "_faculty_v" USING btree ("version_photo_id");
  CREATE INDEX "_faculty_v_version_version_slug_idx" ON "_faculty_v" USING btree ("version_slug");
  CREATE INDEX "_faculty_v_version_version_show_on_home_idx" ON "_faculty_v" USING btree ("version_show_on_home");
  CREATE INDEX "_faculty_v_version_version_sort_order_idx" ON "_faculty_v" USING btree ("version_sort_order");
  CREATE INDEX "_faculty_v_version_version_updated_at_idx" ON "_faculty_v" USING btree ("version_updated_at");
  CREATE INDEX "_faculty_v_version_version_created_at_idx" ON "_faculty_v" USING btree ("version_created_at");
  CREATE INDEX "_faculty_v_version_version_deleted_at_idx" ON "_faculty_v" USING btree ("version_deleted_at");
  CREATE INDEX "_faculty_v_created_at_idx" ON "_faculty_v" USING btree ("created_at");
  CREATE INDEX "_faculty_v_updated_at_idx" ON "_faculty_v" USING btree ("updated_at");
  CREATE INDEX "_faculty_v_published_locale_idx" ON "_faculty_v" USING btree ("published_locale");
  CREATE INDEX "_faculty_v_latest_idx" ON "_faculty_v" USING btree ("latest");
  CREATE INDEX "_faculty_v_autosave_idx" ON "_faculty_v" USING btree ("autosave");
  CREATE INDEX "_faculty_v_version_meta_version_meta_image_idx" ON "_faculty_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE INDEX "_faculty_v_version_version__status_idx" ON "_faculty_v_locales" USING btree ("version__status","_locale");
  CREATE UNIQUE INDEX "_faculty_v_locales_parent_id_locale_unique" ON "_faculty_v_locales" USING btree ("_parent_id","_locale");
  CREATE INDEX "_faculty_v_texts_order_parent" ON "_faculty_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_faculty_v_rels_order_idx" ON "_faculty_v_rels" USING btree ("order");
  CREATE INDEX "_faculty_v_rels_parent_idx" ON "_faculty_v_rels" USING btree ("parent_id");
  CREATE INDEX "_faculty_v_rels_path_idx" ON "_faculty_v_rels" USING btree ("path");
  CREATE INDEX "_faculty_v_rels_admins_id_idx" ON "_faculty_v_rels" USING btree ("admins_id");
  CREATE INDEX "pmb_applications_notes_order_idx" ON "pmb_applications_notes" USING btree ("_order");
  CREATE INDEX "pmb_applications_notes_parent_id_idx" ON "pmb_applications_notes" USING btree ("_parent_id");
  CREATE INDEX "pmb_applications_notes_author_idx" ON "pmb_applications_notes" USING btree ("author_id");
  CREATE INDEX "pmb_applications_status_history_order_idx" ON "pmb_applications_status_history" USING btree ("_order");
  CREATE INDEX "pmb_applications_status_history_parent_id_idx" ON "pmb_applications_status_history" USING btree ("_parent_id");
  CREATE INDEX "pmb_applications_status_history_changed_by_idx" ON "pmb_applications_status_history" USING btree ("changed_by_id");
  CREATE UNIQUE INDEX "pmb_applications_reg_number_idx" ON "pmb_applications" USING btree ("reg_number");
  CREATE INDEX "pmb_applications_status_idx" ON "pmb_applications" USING btree ("status");
  CREATE INDEX "pmb_applications_assigned_to_idx" ON "pmb_applications" USING btree ("assigned_to_id");
  CREATE INDEX "pmb_applications_email_idx" ON "pmb_applications" USING btree ("email");
  CREATE INDEX "pmb_applications_wave_idx" ON "pmb_applications" USING btree ("wave_id");
  CREATE INDEX "pmb_applications_track_idx" ON "pmb_applications" USING btree ("track_id");
  CREATE INDEX "pmb_applications_lead_idx" ON "pmb_applications" USING btree ("lead_id");
  CREATE INDEX "pmb_applications_possible_duplicate_idx" ON "pmb_applications" USING btree ("possible_duplicate");
  CREATE INDEX "pmb_applications_duplicate_of_idx" ON "pmb_applications" USING btree ("duplicate_of_id");
  CREATE INDEX "pmb_applications_phone_normalized_idx" ON "pmb_applications" USING btree ("phone_normalized");
  CREATE INDEX "pmb_applications_updated_at_idx" ON "pmb_applications" USING btree ("updated_at");
  CREATE INDEX "pmb_applications_created_at_idx" ON "pmb_applications" USING btree ("created_at");
  CREATE INDEX "pmb_applications_rels_order_idx" ON "pmb_applications_rels" USING btree ("order");
  CREATE INDEX "pmb_applications_rels_parent_idx" ON "pmb_applications_rels" USING btree ("parent_id");
  CREATE INDEX "pmb_applications_rels_path_idx" ON "pmb_applications_rels" USING btree ("path");
  CREATE INDEX "pmb_applications_rels_admins_id_idx" ON "pmb_applications_rels" USING btree ("admins_id");
  CREATE INDEX "_pmb_applications_v_version_notes_order_idx" ON "_pmb_applications_v_version_notes" USING btree ("_order");
  CREATE INDEX "_pmb_applications_v_version_notes_parent_id_idx" ON "_pmb_applications_v_version_notes" USING btree ("_parent_id");
  CREATE INDEX "_pmb_applications_v_version_notes_author_idx" ON "_pmb_applications_v_version_notes" USING btree ("author_id");
  CREATE INDEX "_pmb_applications_v_version_status_history_order_idx" ON "_pmb_applications_v_version_status_history" USING btree ("_order");
  CREATE INDEX "_pmb_applications_v_version_status_history_parent_id_idx" ON "_pmb_applications_v_version_status_history" USING btree ("_parent_id");
  CREATE INDEX "_pmb_applications_v_version_status_history_changed_by_idx" ON "_pmb_applications_v_version_status_history" USING btree ("changed_by_id");
  CREATE INDEX "_pmb_applications_v_parent_idx" ON "_pmb_applications_v" USING btree ("parent_id");
  CREATE INDEX "_pmb_applications_v_version_version_reg_number_idx" ON "_pmb_applications_v" USING btree ("version_reg_number");
  CREATE INDEX "_pmb_applications_v_version_version_status_idx" ON "_pmb_applications_v" USING btree ("version_status");
  CREATE INDEX "_pmb_applications_v_version_version_assigned_to_idx" ON "_pmb_applications_v" USING btree ("version_assigned_to_id");
  CREATE INDEX "_pmb_applications_v_version_version_email_idx" ON "_pmb_applications_v" USING btree ("version_email");
  CREATE INDEX "_pmb_applications_v_version_version_wave_idx" ON "_pmb_applications_v" USING btree ("version_wave_id");
  CREATE INDEX "_pmb_applications_v_version_version_track_idx" ON "_pmb_applications_v" USING btree ("version_track_id");
  CREATE INDEX "_pmb_applications_v_version_version_lead_idx" ON "_pmb_applications_v" USING btree ("version_lead_id");
  CREATE INDEX "_pmb_applications_v_version_version_possible_duplicate_idx" ON "_pmb_applications_v" USING btree ("version_possible_duplicate");
  CREATE INDEX "_pmb_applications_v_version_version_duplicate_of_idx" ON "_pmb_applications_v" USING btree ("version_duplicate_of_id");
  CREATE INDEX "_pmb_applications_v_version_version_phone_normalized_idx" ON "_pmb_applications_v" USING btree ("version_phone_normalized");
  CREATE INDEX "_pmb_applications_v_version_version_updated_at_idx" ON "_pmb_applications_v" USING btree ("version_updated_at");
  CREATE INDEX "_pmb_applications_v_version_version_created_at_idx" ON "_pmb_applications_v" USING btree ("version_created_at");
  CREATE INDEX "_pmb_applications_v_created_at_idx" ON "_pmb_applications_v" USING btree ("created_at");
  CREATE INDEX "_pmb_applications_v_updated_at_idx" ON "_pmb_applications_v" USING btree ("updated_at");
  CREATE INDEX "_pmb_applications_v_rels_order_idx" ON "_pmb_applications_v_rels" USING btree ("order");
  CREATE INDEX "_pmb_applications_v_rels_parent_idx" ON "_pmb_applications_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pmb_applications_v_rels_path_idx" ON "_pmb_applications_v_rels" USING btree ("path");
  CREATE INDEX "_pmb_applications_v_rels_admins_id_idx" ON "_pmb_applications_v_rels" USING btree ("admins_id");
  CREATE INDEX "leads_sources_order_idx" ON "leads_sources" USING btree ("order");
  CREATE INDEX "leads_sources_parent_idx" ON "leads_sources" USING btree ("parent_id");
  CREATE INDEX "leads_notes_order_idx" ON "leads_notes" USING btree ("_order");
  CREATE INDEX "leads_notes_parent_id_idx" ON "leads_notes" USING btree ("_parent_id");
  CREATE INDEX "leads_notes_author_idx" ON "leads_notes" USING btree ("author_id");
  CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_assigned_to_idx" ON "leads" USING btree ("assigned_to_id");
  CREATE INDEX "leads_follow_up_at_idx" ON "leads" USING btree ("follow_up_at");
  CREATE INDEX "leads_first_source_idx" ON "leads" USING btree ("first_source");
  CREATE INDEX "leads_quiz_attempt_idx" ON "leads" USING btree ("quiz_attempt_id");
  CREATE INDEX "leads_application_idx" ON "leads" USING btree ("application_id");
  CREATE INDEX "leads_deletion_requested_idx" ON "leads" USING btree ("deletion_requested");
  CREATE INDEX "leads_last_activity_at_idx" ON "leads" USING btree ("last_activity_at");
  CREATE INDEX "leads_phone_normalized_idx" ON "leads" USING btree ("phone_normalized");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "leads_deleted_at_idx" ON "leads" USING btree ("deleted_at");
  CREATE INDEX "leads_texts_order_parent" ON "leads_texts" USING btree ("order","parent_id");
  CREATE INDEX "leads_rels_order_idx" ON "leads_rels" USING btree ("order");
  CREATE INDEX "leads_rels_parent_idx" ON "leads_rels" USING btree ("parent_id");
  CREATE INDEX "leads_rels_path_idx" ON "leads_rels" USING btree ("path");
  CREATE INDEX "leads_rels_admins_id_idx" ON "leads_rels" USING btree ("admins_id");
  CREATE INDEX "_leads_v_version_sources_order_idx" ON "_leads_v_version_sources" USING btree ("order");
  CREATE INDEX "_leads_v_version_sources_parent_idx" ON "_leads_v_version_sources" USING btree ("parent_id");
  CREATE INDEX "_leads_v_version_notes_order_idx" ON "_leads_v_version_notes" USING btree ("_order");
  CREATE INDEX "_leads_v_version_notes_parent_id_idx" ON "_leads_v_version_notes" USING btree ("_parent_id");
  CREATE INDEX "_leads_v_version_notes_author_idx" ON "_leads_v_version_notes" USING btree ("author_id");
  CREATE INDEX "_leads_v_parent_idx" ON "_leads_v" USING btree ("parent_id");
  CREATE INDEX "_leads_v_version_version_email_idx" ON "_leads_v" USING btree ("version_email");
  CREATE INDEX "_leads_v_version_version_status_idx" ON "_leads_v" USING btree ("version_status");
  CREATE INDEX "_leads_v_version_version_assigned_to_idx" ON "_leads_v" USING btree ("version_assigned_to_id");
  CREATE INDEX "_leads_v_version_version_follow_up_at_idx" ON "_leads_v" USING btree ("version_follow_up_at");
  CREATE INDEX "_leads_v_version_version_first_source_idx" ON "_leads_v" USING btree ("version_first_source");
  CREATE INDEX "_leads_v_version_version_quiz_attempt_idx" ON "_leads_v" USING btree ("version_quiz_attempt_id");
  CREATE INDEX "_leads_v_version_version_application_idx" ON "_leads_v" USING btree ("version_application_id");
  CREATE INDEX "_leads_v_version_version_deletion_requested_idx" ON "_leads_v" USING btree ("version_deletion_requested");
  CREATE INDEX "_leads_v_version_version_last_activity_at_idx" ON "_leads_v" USING btree ("version_last_activity_at");
  CREATE INDEX "_leads_v_version_version_phone_normalized_idx" ON "_leads_v" USING btree ("version_phone_normalized");
  CREATE INDEX "_leads_v_version_version_updated_at_idx" ON "_leads_v" USING btree ("version_updated_at");
  CREATE INDEX "_leads_v_version_version_created_at_idx" ON "_leads_v" USING btree ("version_created_at");
  CREATE INDEX "_leads_v_version_version_deleted_at_idx" ON "_leads_v" USING btree ("version_deleted_at");
  CREATE INDEX "_leads_v_created_at_idx" ON "_leads_v" USING btree ("created_at");
  CREATE INDEX "_leads_v_updated_at_idx" ON "_leads_v" USING btree ("updated_at");
  CREATE INDEX "_leads_v_texts_order_parent" ON "_leads_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_leads_v_rels_order_idx" ON "_leads_v_rels" USING btree ("order");
  CREATE INDEX "_leads_v_rels_parent_idx" ON "_leads_v_rels" USING btree ("parent_id");
  CREATE INDEX "_leads_v_rels_path_idx" ON "_leads_v_rels" USING btree ("path");
  CREATE INDEX "_leads_v_rels_admins_id_idx" ON "_leads_v_rels" USING btree ("admins_id");
  CREATE INDEX "contact_messages_status_idx" ON "contact_messages" USING btree ("status");
  CREATE INDEX "contact_messages_lead_idx" ON "contact_messages" USING btree ("lead_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "contact_messages_rels_order_idx" ON "contact_messages_rels" USING btree ("order");
  CREATE INDEX "contact_messages_rels_parent_idx" ON "contact_messages_rels" USING btree ("parent_id");
  CREATE INDEX "contact_messages_rels_path_idx" ON "contact_messages_rels" USING btree ("path");
  CREATE INDEX "contact_messages_rels_admins_id_idx" ON "contact_messages_rels" USING btree ("admins_id");
  CREATE INDEX "_contact_messages_v_parent_idx" ON "_contact_messages_v" USING btree ("parent_id");
  CREATE INDEX "_contact_messages_v_version_version_status_idx" ON "_contact_messages_v" USING btree ("version_status");
  CREATE INDEX "_contact_messages_v_version_version_lead_idx" ON "_contact_messages_v" USING btree ("version_lead_id");
  CREATE INDEX "_contact_messages_v_version_version_updated_at_idx" ON "_contact_messages_v" USING btree ("version_updated_at");
  CREATE INDEX "_contact_messages_v_version_version_created_at_idx" ON "_contact_messages_v" USING btree ("version_created_at");
  CREATE INDEX "_contact_messages_v_created_at_idx" ON "_contact_messages_v" USING btree ("created_at");
  CREATE INDEX "_contact_messages_v_updated_at_idx" ON "_contact_messages_v" USING btree ("updated_at");
  CREATE INDEX "_contact_messages_v_rels_order_idx" ON "_contact_messages_v_rels" USING btree ("order");
  CREATE INDEX "_contact_messages_v_rels_parent_idx" ON "_contact_messages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_contact_messages_v_rels_path_idx" ON "_contact_messages_v_rels" USING btree ("path");
  CREATE INDEX "_contact_messages_v_rels_admins_id_idx" ON "_contact_messages_v_rels" USING btree ("admins_id");
  CREATE INDEX "pmb_waves_close_date_idx" ON "pmb_waves" USING btree ("close_date");
  CREATE INDEX "pmb_waves_status_idx" ON "pmb_waves" USING btree ("status");
  CREATE INDEX "pmb_waves_sort_order_idx" ON "pmb_waves" USING btree ("sort_order");
  CREATE INDEX "pmb_waves_updated_at_idx" ON "pmb_waves" USING btree ("updated_at");
  CREATE INDEX "pmb_waves_created_at_idx" ON "pmb_waves" USING btree ("created_at");
  CREATE INDEX "pmb_waves_rels_order_idx" ON "pmb_waves_rels" USING btree ("order");
  CREATE INDEX "pmb_waves_rels_parent_idx" ON "pmb_waves_rels" USING btree ("parent_id");
  CREATE INDEX "pmb_waves_rels_path_idx" ON "pmb_waves_rels" USING btree ("path");
  CREATE INDEX "pmb_waves_rels_admins_id_idx" ON "pmb_waves_rels" USING btree ("admins_id");
  CREATE INDEX "_pmb_waves_v_parent_idx" ON "_pmb_waves_v" USING btree ("parent_id");
  CREATE INDEX "_pmb_waves_v_version_version_close_date_idx" ON "_pmb_waves_v" USING btree ("version_close_date");
  CREATE INDEX "_pmb_waves_v_version_version_status_idx" ON "_pmb_waves_v" USING btree ("version_status");
  CREATE INDEX "_pmb_waves_v_version_version_sort_order_idx" ON "_pmb_waves_v" USING btree ("version_sort_order");
  CREATE INDEX "_pmb_waves_v_version_version_updated_at_idx" ON "_pmb_waves_v" USING btree ("version_updated_at");
  CREATE INDEX "_pmb_waves_v_version_version_created_at_idx" ON "_pmb_waves_v" USING btree ("version_created_at");
  CREATE INDEX "_pmb_waves_v_created_at_idx" ON "_pmb_waves_v" USING btree ("created_at");
  CREATE INDEX "_pmb_waves_v_updated_at_idx" ON "_pmb_waves_v" USING btree ("updated_at");
  CREATE INDEX "_pmb_waves_v_rels_order_idx" ON "_pmb_waves_v_rels" USING btree ("order");
  CREATE INDEX "_pmb_waves_v_rels_parent_idx" ON "_pmb_waves_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pmb_waves_v_rels_path_idx" ON "_pmb_waves_v_rels" USING btree ("path");
  CREATE INDEX "_pmb_waves_v_rels_admins_id_idx" ON "_pmb_waves_v_rels" USING btree ("admins_id");
  CREATE INDEX "pmb_tracks_highlights_order_idx" ON "pmb_tracks_highlights" USING btree ("_order");
  CREATE INDEX "pmb_tracks_highlights_parent_id_idx" ON "pmb_tracks_highlights" USING btree ("_parent_id");
  CREATE INDEX "pmb_tracks_is_active_idx" ON "pmb_tracks" USING btree ("is_active");
  CREATE INDEX "pmb_tracks_sort_order_idx" ON "pmb_tracks" USING btree ("sort_order");
  CREATE INDEX "pmb_tracks_updated_at_idx" ON "pmb_tracks" USING btree ("updated_at");
  CREATE INDEX "pmb_tracks_created_at_idx" ON "pmb_tracks" USING btree ("created_at");
  CREATE INDEX "pmb_tracks_rels_order_idx" ON "pmb_tracks_rels" USING btree ("order");
  CREATE INDEX "pmb_tracks_rels_parent_idx" ON "pmb_tracks_rels" USING btree ("parent_id");
  CREATE INDEX "pmb_tracks_rels_path_idx" ON "pmb_tracks_rels" USING btree ("path");
  CREATE INDEX "pmb_tracks_rels_admins_id_idx" ON "pmb_tracks_rels" USING btree ("admins_id");
  CREATE INDEX "_pmb_tracks_v_version_highlights_order_idx" ON "_pmb_tracks_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_pmb_tracks_v_version_highlights_parent_id_idx" ON "_pmb_tracks_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_pmb_tracks_v_parent_idx" ON "_pmb_tracks_v" USING btree ("parent_id");
  CREATE INDEX "_pmb_tracks_v_version_version_is_active_idx" ON "_pmb_tracks_v" USING btree ("version_is_active");
  CREATE INDEX "_pmb_tracks_v_version_version_sort_order_idx" ON "_pmb_tracks_v" USING btree ("version_sort_order");
  CREATE INDEX "_pmb_tracks_v_version_version_updated_at_idx" ON "_pmb_tracks_v" USING btree ("version_updated_at");
  CREATE INDEX "_pmb_tracks_v_version_version_created_at_idx" ON "_pmb_tracks_v" USING btree ("version_created_at");
  CREATE INDEX "_pmb_tracks_v_created_at_idx" ON "_pmb_tracks_v" USING btree ("created_at");
  CREATE INDEX "_pmb_tracks_v_updated_at_idx" ON "_pmb_tracks_v" USING btree ("updated_at");
  CREATE INDEX "_pmb_tracks_v_rels_order_idx" ON "_pmb_tracks_v_rels" USING btree ("order");
  CREATE INDEX "_pmb_tracks_v_rels_parent_idx" ON "_pmb_tracks_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pmb_tracks_v_rels_path_idx" ON "_pmb_tracks_v_rels" USING btree ("path");
  CREATE INDEX "_pmb_tracks_v_rels_admins_id_idx" ON "_pmb_tracks_v_rels" USING btree ("admins_id");
  CREATE INDEX "message_templates_updated_at_idx" ON "message_templates" USING btree ("updated_at");
  CREATE INDEX "message_templates_created_at_idx" ON "message_templates" USING btree ("created_at");
  CREATE INDEX "message_templates_rels_order_idx" ON "message_templates_rels" USING btree ("order");
  CREATE INDEX "message_templates_rels_parent_idx" ON "message_templates_rels" USING btree ("parent_id");
  CREATE INDEX "message_templates_rels_path_idx" ON "message_templates_rels" USING btree ("path");
  CREATE INDEX "message_templates_rels_admins_id_idx" ON "message_templates_rels" USING btree ("admins_id");
  CREATE INDEX "_message_templates_v_parent_idx" ON "_message_templates_v" USING btree ("parent_id");
  CREATE INDEX "_message_templates_v_version_version_updated_at_idx" ON "_message_templates_v" USING btree ("version_updated_at");
  CREATE INDEX "_message_templates_v_version_version_created_at_idx" ON "_message_templates_v" USING btree ("version_created_at");
  CREATE INDEX "_message_templates_v_created_at_idx" ON "_message_templates_v" USING btree ("created_at");
  CREATE INDEX "_message_templates_v_updated_at_idx" ON "_message_templates_v" USING btree ("updated_at");
  CREATE INDEX "_message_templates_v_rels_order_idx" ON "_message_templates_v_rels" USING btree ("order");
  CREATE INDEX "_message_templates_v_rels_parent_idx" ON "_message_templates_v_rels" USING btree ("parent_id");
  CREATE INDEX "_message_templates_v_rels_path_idx" ON "_message_templates_v_rels" USING btree ("path");
  CREATE INDEX "_message_templates_v_rels_admins_id_idx" ON "_message_templates_v_rels" USING btree ("admins_id");
  CREATE INDEX "pmb_documents_application_idx" ON "pmb_documents" USING btree ("application_id");
  CREATE INDEX "pmb_documents_updated_at_idx" ON "pmb_documents" USING btree ("updated_at");
  CREATE INDEX "pmb_documents_created_at_idx" ON "pmb_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "pmb_documents_filename_idx" ON "pmb_documents" USING btree ("filename");
  CREATE INDEX "pmb_documents_original_original_filename_idx" ON "pmb_documents" USING btree ("original_filename");
  CREATE INDEX "pmb_documents_rels_order_idx" ON "pmb_documents_rels" USING btree ("order");
  CREATE INDEX "pmb_documents_rels_parent_idx" ON "pmb_documents_rels" USING btree ("parent_id");
  CREATE INDEX "pmb_documents_rels_path_idx" ON "pmb_documents_rels" USING btree ("path");
  CREATE INDEX "pmb_documents_rels_admins_id_idx" ON "pmb_documents_rels" USING btree ("admins_id");
  CREATE INDEX "_pmb_documents_v_parent_idx" ON "_pmb_documents_v" USING btree ("parent_id");
  CREATE INDEX "_pmb_documents_v_version_version_application_idx" ON "_pmb_documents_v" USING btree ("version_application_id");
  CREATE INDEX "_pmb_documents_v_version_version_updated_at_idx" ON "_pmb_documents_v" USING btree ("version_updated_at");
  CREATE INDEX "_pmb_documents_v_version_version_created_at_idx" ON "_pmb_documents_v" USING btree ("version_created_at");
  CREATE INDEX "_pmb_documents_v_version_version_filename_idx" ON "_pmb_documents_v" USING btree ("version_filename");
  CREATE INDEX "_pmb_documents_v_version_original_version_original_filen_idx" ON "_pmb_documents_v" USING btree ("version_original_filename");
  CREATE INDEX "_pmb_documents_v_created_at_idx" ON "_pmb_documents_v" USING btree ("created_at");
  CREATE INDEX "_pmb_documents_v_updated_at_idx" ON "_pmb_documents_v" USING btree ("updated_at");
  CREATE INDEX "_pmb_documents_v_rels_order_idx" ON "_pmb_documents_v_rels" USING btree ("order");
  CREATE INDEX "_pmb_documents_v_rels_parent_idx" ON "_pmb_documents_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pmb_documents_v_rels_path_idx" ON "_pmb_documents_v_rels" USING btree ("path");
  CREATE INDEX "_pmb_documents_v_rels_admins_id_idx" ON "_pmb_documents_v_rels" USING btree ("admins_id");
  CREATE INDEX "quiz_questions_options_order_idx" ON "quiz_questions_options" USING btree ("_order");
  CREATE INDEX "quiz_questions_options_parent_id_idx" ON "quiz_questions_options" USING btree ("_parent_id");
  CREATE INDEX "quiz_questions_image_idx" ON "quiz_questions" USING btree ("image_id");
  CREATE INDEX "quiz_questions_is_active_idx" ON "quiz_questions" USING btree ("is_active");
  CREATE INDEX "quiz_questions_sort_order_idx" ON "quiz_questions" USING btree ("sort_order");
  CREATE INDEX "quiz_questions_updated_at_idx" ON "quiz_questions" USING btree ("updated_at");
  CREATE INDEX "quiz_questions_created_at_idx" ON "quiz_questions" USING btree ("created_at");
  CREATE INDEX "quiz_questions_rels_order_idx" ON "quiz_questions_rels" USING btree ("order");
  CREATE INDEX "quiz_questions_rels_parent_idx" ON "quiz_questions_rels" USING btree ("parent_id");
  CREATE INDEX "quiz_questions_rels_path_idx" ON "quiz_questions_rels" USING btree ("path");
  CREATE INDEX "quiz_questions_rels_admins_id_idx" ON "quiz_questions_rels" USING btree ("admins_id");
  CREATE INDEX "_quiz_questions_v_version_options_order_idx" ON "_quiz_questions_v_version_options" USING btree ("_order");
  CREATE INDEX "_quiz_questions_v_version_options_parent_id_idx" ON "_quiz_questions_v_version_options" USING btree ("_parent_id");
  CREATE INDEX "_quiz_questions_v_parent_idx" ON "_quiz_questions_v" USING btree ("parent_id");
  CREATE INDEX "_quiz_questions_v_version_version_image_idx" ON "_quiz_questions_v" USING btree ("version_image_id");
  CREATE INDEX "_quiz_questions_v_version_version_is_active_idx" ON "_quiz_questions_v" USING btree ("version_is_active");
  CREATE INDEX "_quiz_questions_v_version_version_sort_order_idx" ON "_quiz_questions_v" USING btree ("version_sort_order");
  CREATE INDEX "_quiz_questions_v_version_version_updated_at_idx" ON "_quiz_questions_v" USING btree ("version_updated_at");
  CREATE INDEX "_quiz_questions_v_version_version_created_at_idx" ON "_quiz_questions_v" USING btree ("version_created_at");
  CREATE INDEX "_quiz_questions_v_created_at_idx" ON "_quiz_questions_v" USING btree ("created_at");
  CREATE INDEX "_quiz_questions_v_updated_at_idx" ON "_quiz_questions_v" USING btree ("updated_at");
  CREATE INDEX "_quiz_questions_v_rels_order_idx" ON "_quiz_questions_v_rels" USING btree ("order");
  CREATE INDEX "_quiz_questions_v_rels_parent_idx" ON "_quiz_questions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_quiz_questions_v_rels_path_idx" ON "_quiz_questions_v_rels" USING btree ("path");
  CREATE INDEX "_quiz_questions_v_rels_admins_id_idx" ON "_quiz_questions_v_rels" USING btree ("admins_id");
  CREATE INDEX "quiz_results_semesters_order_idx" ON "quiz_results_semesters" USING btree ("order");
  CREATE INDEX "quiz_results_semesters_parent_idx" ON "quiz_results_semesters" USING btree ("parent_id");
  CREATE UNIQUE INDEX "quiz_results_pair_key_idx" ON "quiz_results" USING btree ("pair_key");
  CREATE INDEX "quiz_results_updated_at_idx" ON "quiz_results" USING btree ("updated_at");
  CREATE INDEX "quiz_results_created_at_idx" ON "quiz_results" USING btree ("created_at");
  CREATE INDEX "quiz_results_texts_order_parent" ON "quiz_results_texts" USING btree ("order","parent_id");
  CREATE INDEX "quiz_results_rels_order_idx" ON "quiz_results_rels" USING btree ("order");
  CREATE INDEX "quiz_results_rels_parent_idx" ON "quiz_results_rels" USING btree ("parent_id");
  CREATE INDEX "quiz_results_rels_path_idx" ON "quiz_results_rels" USING btree ("path");
  CREATE INDEX "quiz_results_rels_courses_id_idx" ON "quiz_results_rels" USING btree ("courses_id");
  CREATE INDEX "quiz_results_rels_admins_id_idx" ON "quiz_results_rels" USING btree ("admins_id");
  CREATE INDEX "_quiz_results_v_version_semesters_order_idx" ON "_quiz_results_v_version_semesters" USING btree ("order");
  CREATE INDEX "_quiz_results_v_version_semesters_parent_idx" ON "_quiz_results_v_version_semesters" USING btree ("parent_id");
  CREATE INDEX "_quiz_results_v_parent_idx" ON "_quiz_results_v" USING btree ("parent_id");
  CREATE INDEX "_quiz_results_v_version_version_pair_key_idx" ON "_quiz_results_v" USING btree ("version_pair_key");
  CREATE INDEX "_quiz_results_v_version_version_updated_at_idx" ON "_quiz_results_v" USING btree ("version_updated_at");
  CREATE INDEX "_quiz_results_v_version_version_created_at_idx" ON "_quiz_results_v" USING btree ("version_created_at");
  CREATE INDEX "_quiz_results_v_created_at_idx" ON "_quiz_results_v" USING btree ("created_at");
  CREATE INDEX "_quiz_results_v_updated_at_idx" ON "_quiz_results_v" USING btree ("updated_at");
  CREATE INDEX "_quiz_results_v_texts_order_parent" ON "_quiz_results_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_quiz_results_v_rels_order_idx" ON "_quiz_results_v_rels" USING btree ("order");
  CREATE INDEX "_quiz_results_v_rels_parent_idx" ON "_quiz_results_v_rels" USING btree ("parent_id");
  CREATE INDEX "_quiz_results_v_rels_path_idx" ON "_quiz_results_v_rels" USING btree ("path");
  CREATE INDEX "_quiz_results_v_rels_courses_id_idx" ON "_quiz_results_v_rels" USING btree ("courses_id");
  CREATE INDEX "_quiz_results_v_rels_admins_id_idx" ON "_quiz_results_v_rels" USING btree ("admins_id");
  CREATE INDEX "quiz_attempts_result_idx" ON "quiz_attempts" USING btree ("result_id");
  CREATE INDEX "quiz_attempts_lead_idx" ON "quiz_attempts" USING btree ("lead_id");
  CREATE INDEX "quiz_attempts_session_id_idx" ON "quiz_attempts" USING btree ("session_id");
  CREATE INDEX "quiz_attempts_is_test_idx" ON "quiz_attempts" USING btree ("is_test");
  CREATE INDEX "quiz_attempts_updated_at_idx" ON "quiz_attempts" USING btree ("updated_at");
  CREATE INDEX "quiz_attempts_created_at_idx" ON "quiz_attempts" USING btree ("created_at");
  CREATE INDEX "quiz_attempts_rels_order_idx" ON "quiz_attempts_rels" USING btree ("order");
  CREATE INDEX "quiz_attempts_rels_parent_idx" ON "quiz_attempts_rels" USING btree ("parent_id");
  CREATE INDEX "quiz_attempts_rels_path_idx" ON "quiz_attempts_rels" USING btree ("path");
  CREATE INDEX "quiz_attempts_rels_admins_id_idx" ON "quiz_attempts_rels" USING btree ("admins_id");
  CREATE INDEX "_quiz_attempts_v_parent_idx" ON "_quiz_attempts_v" USING btree ("parent_id");
  CREATE INDEX "_quiz_attempts_v_version_version_result_idx" ON "_quiz_attempts_v" USING btree ("version_result_id");
  CREATE INDEX "_quiz_attempts_v_version_version_lead_idx" ON "_quiz_attempts_v" USING btree ("version_lead_id");
  CREATE INDEX "_quiz_attempts_v_version_version_session_id_idx" ON "_quiz_attempts_v" USING btree ("version_session_id");
  CREATE INDEX "_quiz_attempts_v_version_version_is_test_idx" ON "_quiz_attempts_v" USING btree ("version_is_test");
  CREATE INDEX "_quiz_attempts_v_version_version_updated_at_idx" ON "_quiz_attempts_v" USING btree ("version_updated_at");
  CREATE INDEX "_quiz_attempts_v_version_version_created_at_idx" ON "_quiz_attempts_v" USING btree ("version_created_at");
  CREATE INDEX "_quiz_attempts_v_created_at_idx" ON "_quiz_attempts_v" USING btree ("created_at");
  CREATE INDEX "_quiz_attempts_v_updated_at_idx" ON "_quiz_attempts_v" USING btree ("updated_at");
  CREATE INDEX "_quiz_attempts_v_rels_order_idx" ON "_quiz_attempts_v_rels" USING btree ("order");
  CREATE INDEX "_quiz_attempts_v_rels_parent_idx" ON "_quiz_attempts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_quiz_attempts_v_rels_path_idx" ON "_quiz_attempts_v_rels" USING btree ("path");
  CREATE INDEX "_quiz_attempts_v_rels_admins_id_idx" ON "_quiz_attempts_v_rels" USING btree ("admins_id");
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_role_idx" ON "admins" USING btree ("role_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "admins_rels_order_idx" ON "admins_rels" USING btree ("order");
  CREATE INDEX "admins_rels_parent_idx" ON "admins_rels" USING btree ("parent_id");
  CREATE INDEX "admins_rels_path_idx" ON "admins_rels" USING btree ("path");
  CREATE INDEX "admins_rels_admins_id_idx" ON "admins_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "roles_key_idx" ON "roles" USING btree ("key");
  CREATE INDEX "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
  CREATE INDEX "roles_created_at_idx" ON "roles" USING btree ("created_at");
  CREATE INDEX "roles_rels_order_idx" ON "roles_rels" USING btree ("order");
  CREATE INDEX "roles_rels_parent_idx" ON "roles_rels" USING btree ("parent_id");
  CREATE INDEX "roles_rels_path_idx" ON "roles_rels" USING btree ("path");
  CREATE INDEX "roles_rels_admins_id_idx" ON "roles_rels" USING btree ("admins_id");
  CREATE INDEX "_roles_v_parent_idx" ON "_roles_v" USING btree ("parent_id");
  CREATE INDEX "_roles_v_version_version_key_idx" ON "_roles_v" USING btree ("version_key");
  CREATE INDEX "_roles_v_version_version_updated_at_idx" ON "_roles_v" USING btree ("version_updated_at");
  CREATE INDEX "_roles_v_version_version_created_at_idx" ON "_roles_v" USING btree ("version_created_at");
  CREATE INDEX "_roles_v_created_at_idx" ON "_roles_v" USING btree ("created_at");
  CREATE INDEX "_roles_v_updated_at_idx" ON "_roles_v" USING btree ("updated_at");
  CREATE INDEX "_roles_v_rels_order_idx" ON "_roles_v_rels" USING btree ("order");
  CREATE INDEX "_roles_v_rels_parent_idx" ON "_roles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_roles_v_rels_path_idx" ON "_roles_v_rels" USING btree ("path");
  CREATE INDEX "_roles_v_rels_admins_id_idx" ON "_roles_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_admins_id_idx" ON "redirects_rels" USING btree ("admins_id");
  CREATE INDEX "_redirects_v_parent_idx" ON "_redirects_v" USING btree ("parent_id");
  CREATE INDEX "_redirects_v_version_version_from_idx" ON "_redirects_v" USING btree ("version_from");
  CREATE INDEX "_redirects_v_version_version_updated_at_idx" ON "_redirects_v" USING btree ("version_updated_at");
  CREATE INDEX "_redirects_v_version_version_created_at_idx" ON "_redirects_v" USING btree ("version_created_at");
  CREATE INDEX "_redirects_v_created_at_idx" ON "_redirects_v" USING btree ("created_at");
  CREATE INDEX "_redirects_v_updated_at_idx" ON "_redirects_v" USING btree ("updated_at");
  CREATE INDEX "_redirects_v_rels_order_idx" ON "_redirects_v_rels" USING btree ("order");
  CREATE INDEX "_redirects_v_rels_parent_idx" ON "_redirects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_redirects_v_rels_path_idx" ON "_redirects_v_rels" USING btree ("path");
  CREATE INDEX "_redirects_v_rels_admins_id_idx" ON "_redirects_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "not_found_logs_path_idx" ON "not_found_logs" USING btree ("path");
  CREATE INDEX "not_found_logs_last_seen_at_idx" ON "not_found_logs" USING btree ("last_seen_at");
  CREATE INDEX "not_found_logs_resolved_idx" ON "not_found_logs" USING btree ("resolved");
  CREATE INDEX "not_found_logs_updated_at_idx" ON "not_found_logs" USING btree ("updated_at");
  CREATE INDEX "not_found_logs_created_at_idx" ON "not_found_logs" USING btree ("created_at");
  CREATE INDEX "not_found_logs_rels_order_idx" ON "not_found_logs_rels" USING btree ("order");
  CREATE INDEX "not_found_logs_rels_parent_idx" ON "not_found_logs_rels" USING btree ("parent_id");
  CREATE INDEX "not_found_logs_rels_path_idx" ON "not_found_logs_rels" USING btree ("path");
  CREATE INDEX "not_found_logs_rels_admins_id_idx" ON "not_found_logs_rels" USING btree ("admins_id");
  CREATE INDEX "_not_found_logs_v_parent_idx" ON "_not_found_logs_v" USING btree ("parent_id");
  CREATE INDEX "_not_found_logs_v_version_version_path_idx" ON "_not_found_logs_v" USING btree ("version_path");
  CREATE INDEX "_not_found_logs_v_version_version_last_seen_at_idx" ON "_not_found_logs_v" USING btree ("version_last_seen_at");
  CREATE INDEX "_not_found_logs_v_version_version_resolved_idx" ON "_not_found_logs_v" USING btree ("version_resolved");
  CREATE INDEX "_not_found_logs_v_version_version_updated_at_idx" ON "_not_found_logs_v" USING btree ("version_updated_at");
  CREATE INDEX "_not_found_logs_v_version_version_created_at_idx" ON "_not_found_logs_v" USING btree ("version_created_at");
  CREATE INDEX "_not_found_logs_v_created_at_idx" ON "_not_found_logs_v" USING btree ("created_at");
  CREATE INDEX "_not_found_logs_v_updated_at_idx" ON "_not_found_logs_v" USING btree ("updated_at");
  CREATE INDEX "_not_found_logs_v_rels_order_idx" ON "_not_found_logs_v_rels" USING btree ("order");
  CREATE INDEX "_not_found_logs_v_rels_parent_idx" ON "_not_found_logs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_not_found_logs_v_rels_path_idx" ON "_not_found_logs_v_rels" USING btree ("path");
  CREATE INDEX "_not_found_logs_v_rels_admins_id_idx" ON "_not_found_logs_v_rels" USING btree ("admins_id");
  CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");
  CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
  CREATE INDEX "audit_logs_entity_type_idx" ON "audit_logs" USING btree ("entity_type");
  CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs" USING btree ("entity_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "audit_logs_rels_order_idx" ON "audit_logs_rels" USING btree ("order");
  CREATE INDEX "audit_logs_rels_parent_idx" ON "audit_logs_rels" USING btree ("parent_id");
  CREATE INDEX "audit_logs_rels_path_idx" ON "audit_logs_rels" USING btree ("path");
  CREATE INDEX "audit_logs_rels_admins_id_idx" ON "audit_logs_rels" USING btree ("admins_id");
  CREATE INDEX "_audit_logs_v_parent_idx" ON "_audit_logs_v" USING btree ("parent_id");
  CREATE INDEX "_audit_logs_v_version_version_user_idx" ON "_audit_logs_v" USING btree ("version_user_id");
  CREATE INDEX "_audit_logs_v_version_version_action_idx" ON "_audit_logs_v" USING btree ("version_action");
  CREATE INDEX "_audit_logs_v_version_version_entity_type_idx" ON "_audit_logs_v" USING btree ("version_entity_type");
  CREATE INDEX "_audit_logs_v_version_version_entity_id_idx" ON "_audit_logs_v" USING btree ("version_entity_id");
  CREATE INDEX "_audit_logs_v_version_version_updated_at_idx" ON "_audit_logs_v" USING btree ("version_updated_at");
  CREATE INDEX "_audit_logs_v_version_version_created_at_idx" ON "_audit_logs_v" USING btree ("version_created_at");
  CREATE INDEX "_audit_logs_v_created_at_idx" ON "_audit_logs_v" USING btree ("created_at");
  CREATE INDEX "_audit_logs_v_updated_at_idx" ON "_audit_logs_v" USING btree ("updated_at");
  CREATE INDEX "_audit_logs_v_rels_order_idx" ON "_audit_logs_v_rels" USING btree ("order");
  CREATE INDEX "_audit_logs_v_rels_parent_idx" ON "_audit_logs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_audit_logs_v_rels_path_idx" ON "_audit_logs_v_rels" USING btree ("path");
  CREATE INDEX "_audit_logs_v_rels_admins_id_idx" ON "_audit_logs_v_rels" USING btree ("admins_id");
  CREATE INDEX "analytics_events_name_idx" ON "analytics_events" USING btree ("name");
  CREATE INDEX "analytics_events_path_idx" ON "analytics_events" USING btree ("path");
  CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id");
  CREATE INDEX "analytics_events_lead_idx" ON "analytics_events" USING btree ("lead_id");
  CREATE INDEX "analytics_events_updated_at_idx" ON "analytics_events" USING btree ("updated_at");
  CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");
  CREATE INDEX "analytics_events_rels_order_idx" ON "analytics_events_rels" USING btree ("order");
  CREATE INDEX "analytics_events_rels_parent_idx" ON "analytics_events_rels" USING btree ("parent_id");
  CREATE INDEX "analytics_events_rels_path_idx" ON "analytics_events_rels" USING btree ("path");
  CREATE INDEX "analytics_events_rels_admins_id_idx" ON "analytics_events_rels" USING btree ("admins_id");
  CREATE INDEX "_analytics_events_v_parent_idx" ON "_analytics_events_v" USING btree ("parent_id");
  CREATE INDEX "_analytics_events_v_version_version_name_idx" ON "_analytics_events_v" USING btree ("version_name");
  CREATE INDEX "_analytics_events_v_version_version_path_idx" ON "_analytics_events_v" USING btree ("version_path");
  CREATE INDEX "_analytics_events_v_version_version_session_id_idx" ON "_analytics_events_v" USING btree ("version_session_id");
  CREATE INDEX "_analytics_events_v_version_version_lead_idx" ON "_analytics_events_v" USING btree ("version_lead_id");
  CREATE INDEX "_analytics_events_v_version_version_updated_at_idx" ON "_analytics_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_analytics_events_v_version_version_created_at_idx" ON "_analytics_events_v" USING btree ("version_created_at");
  CREATE INDEX "_analytics_events_v_created_at_idx" ON "_analytics_events_v" USING btree ("created_at");
  CREATE INDEX "_analytics_events_v_updated_at_idx" ON "_analytics_events_v" USING btree ("updated_at");
  CREATE INDEX "_analytics_events_v_rels_order_idx" ON "_analytics_events_v_rels" USING btree ("order");
  CREATE INDEX "_analytics_events_v_rels_parent_idx" ON "_analytics_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_analytics_events_v_rels_path_idx" ON "_analytics_events_v_rels" USING btree ("path");
  CREATE INDEX "_analytics_events_v_rels_admins_id_idx" ON "_analytics_events_v_rels" USING btree ("admins_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_until_idx" ON "payload_jobs" USING btree ("processing_until");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_post_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("post_tags_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_career_paths_id_idx" ON "payload_locked_documents_rels" USING btree ("career_paths_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_job_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("job_posts_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_curriculum_versions_id_idx" ON "payload_locked_documents_rels" USING btree ("curriculum_versions_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_faculty_id_idx" ON "payload_locked_documents_rels" USING btree ("faculty_id");
  CREATE INDEX "payload_locked_documents_rels_pmb_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("pmb_applications_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_pmb_waves_id_idx" ON "payload_locked_documents_rels" USING btree ("pmb_waves_id");
  CREATE INDEX "payload_locked_documents_rels_pmb_tracks_id_idx" ON "payload_locked_documents_rels" USING btree ("pmb_tracks_id");
  CREATE INDEX "payload_locked_documents_rels_message_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("message_templates_id");
  CREATE INDEX "payload_locked_documents_rels_pmb_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("pmb_documents_id");
  CREATE INDEX "payload_locked_documents_rels_quiz_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_questions_id");
  CREATE INDEX "payload_locked_documents_rels_quiz_results_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_results_id");
  CREATE INDEX "payload_locked_documents_rels_quiz_attempts_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_attempts_id");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("roles_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_not_found_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("not_found_logs_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_events_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_events_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_entity_slug_idx" ON "payload_llm_instructions" USING btree ("entity_slug");
  CREATE INDEX "payload_llm_instructions_updated_at_idx" ON "payload_llm_instructions" USING btree ("updated_at");
  CREATE INDEX "payload_llm_instructions_created_at_idx" ON "payload_llm_instructions" USING btree ("created_at");
  CREATE INDEX "payload_llm_instructions_rels_order_idx" ON "payload_llm_instructions_rels" USING btree ("order");
  CREATE INDEX "payload_llm_instructions_rels_parent_idx" ON "payload_llm_instructions_rels" USING btree ("parent_id");
  CREATE INDEX "payload_llm_instructions_rels_path_idx" ON "payload_llm_instructions_rels" USING btree ("path");
  CREATE INDEX "payload_llm_instructions_rels_admins_id_idx" ON "payload_llm_instructions_rels" USING btree ("admins_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_accreditation_badge_idx" ON "site_settings" USING btree ("accreditation_badge_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_privacy_page_idx" ON "site_settings" USING btree ("privacy_page_id");
  CREATE INDEX "site_settings_terms_page_idx" ON "site_settings" USING btree ("terms_page_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_admins_id_idx" ON "site_settings_rels" USING btree ("admins_id");
  CREATE INDEX "_site_settings_v_version_socials_order_idx" ON "_site_settings_v_version_socials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_socials_parent_id_idx" ON "_site_settings_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version_accreditation_badge_idx" ON "_site_settings_v" USING btree ("version_accreditation_badge_id");
  CREATE INDEX "_site_settings_v_version_version_default_og_image_idx" ON "_site_settings_v" USING btree ("version_default_og_image_id");
  CREATE INDEX "_site_settings_v_version_version_privacy_page_idx" ON "_site_settings_v" USING btree ("version_privacy_page_id");
  CREATE INDEX "_site_settings_v_version_version_terms_page_idx" ON "_site_settings_v" USING btree ("version_terms_page_id");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_rels_order_idx" ON "_site_settings_v_rels" USING btree ("order");
  CREATE INDEX "_site_settings_v_rels_parent_idx" ON "_site_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_site_settings_v_rels_path_idx" ON "_site_settings_v_rels" USING btree ("path");
  CREATE INDEX "_site_settings_v_rels_admins_id_idx" ON "_site_settings_v_rels" USING btree ("admins_id");
  CREATE INDEX "branding_lines_order_idx" ON "branding_lines" USING btree ("_order");
  CREATE INDEX "branding_lines_parent_id_idx" ON "branding_lines" USING btree ("_parent_id");
  CREATE INDEX "branding_wordmark_light_idx" ON "branding" USING btree ("wordmark_light_id");
  CREATE INDEX "branding_wordmark_dark_idx" ON "branding" USING btree ("wordmark_dark_id");
  CREATE INDEX "branding_symbol_idx" ON "branding" USING btree ("symbol_id");
  CREATE INDEX "branding_favicon_idx" ON "branding" USING btree ("favicon_id");
  CREATE INDEX "branding_og_default_idx" ON "branding" USING btree ("og_default_id");
  CREATE INDEX "branding_poses_greeting_poses_greeting_image_idx" ON "branding" USING btree ("poses_greeting_image_id");
  CREATE INDEX "branding_poses_greeting_poses_greeting_image2x_idx" ON "branding" USING btree ("poses_greeting_image2x_id");
  CREATE INDEX "branding_poses_pointing_poses_pointing_image_idx" ON "branding" USING btree ("poses_pointing_image_id");
  CREATE INDEX "branding_poses_pointing_poses_pointing_image2x_idx" ON "branding" USING btree ("poses_pointing_image2x_id");
  CREATE INDEX "branding_poses_thinking_poses_thinking_image_idx" ON "branding" USING btree ("poses_thinking_image_id");
  CREATE INDEX "branding_poses_thinking_poses_thinking_image2x_idx" ON "branding" USING btree ("poses_thinking_image2x_id");
  CREATE INDEX "branding_poses_celebrating_poses_celebrating_image_idx" ON "branding" USING btree ("poses_celebrating_image_id");
  CREATE INDEX "branding_poses_celebrating_poses_celebrating_image2x_idx" ON "branding" USING btree ("poses_celebrating_image2x_id");
  CREATE INDEX "branding_poses_confused_poses_confused_image_idx" ON "branding" USING btree ("poses_confused_image_id");
  CREATE INDEX "branding_poses_confused_poses_confused_image2x_idx" ON "branding" USING btree ("poses_confused_image2x_id");
  CREATE INDEX "branding_poses_tablet_poses_tablet_image_idx" ON "branding" USING btree ("poses_tablet_image_id");
  CREATE INDEX "branding_poses_tablet_poses_tablet_image2x_idx" ON "branding" USING btree ("poses_tablet_image2x_id");
  CREATE INDEX "branding_glb_model_idx" ON "branding" USING btree ("glb_model_id");
  CREATE INDEX "branding_rels_order_idx" ON "branding_rels" USING btree ("order");
  CREATE INDEX "branding_rels_parent_idx" ON "branding_rels" USING btree ("parent_id");
  CREATE INDEX "branding_rels_path_idx" ON "branding_rels" USING btree ("path");
  CREATE INDEX "branding_rels_admins_id_idx" ON "branding_rels" USING btree ("admins_id");
  CREATE INDEX "_branding_v_version_lines_order_idx" ON "_branding_v_version_lines" USING btree ("_order");
  CREATE INDEX "_branding_v_version_lines_parent_id_idx" ON "_branding_v_version_lines" USING btree ("_parent_id");
  CREATE INDEX "_branding_v_version_version_wordmark_light_idx" ON "_branding_v" USING btree ("version_wordmark_light_id");
  CREATE INDEX "_branding_v_version_version_wordmark_dark_idx" ON "_branding_v" USING btree ("version_wordmark_dark_id");
  CREATE INDEX "_branding_v_version_version_symbol_idx" ON "_branding_v" USING btree ("version_symbol_id");
  CREATE INDEX "_branding_v_version_version_favicon_idx" ON "_branding_v" USING btree ("version_favicon_id");
  CREATE INDEX "_branding_v_version_version_og_default_idx" ON "_branding_v" USING btree ("version_og_default_id");
  CREATE INDEX "_branding_v_version_poses_greeting_version_poses_greetin_idx" ON "_branding_v" USING btree ("version_poses_greeting_image_id");
  CREATE INDEX "_branding_v_version_poses_greeting_version_poses_greet_1_idx" ON "_branding_v" USING btree ("version_poses_greeting_image2x_id");
  CREATE INDEX "_branding_v_version_poses_pointing_version_poses_pointin_idx" ON "_branding_v" USING btree ("version_poses_pointing_image_id");
  CREATE INDEX "_branding_v_version_poses_pointing_version_poses_point_1_idx" ON "_branding_v" USING btree ("version_poses_pointing_image2x_id");
  CREATE INDEX "_branding_v_version_poses_thinking_version_poses_thinkin_idx" ON "_branding_v" USING btree ("version_poses_thinking_image_id");
  CREATE INDEX "_branding_v_version_poses_thinking_version_poses_think_1_idx" ON "_branding_v" USING btree ("version_poses_thinking_image2x_id");
  CREATE INDEX "_branding_v_version_poses_celebrating_version_poses_cele_idx" ON "_branding_v" USING btree ("version_poses_celebrating_image_id");
  CREATE INDEX "_branding_v_version_poses_celebrating_version_poses_ce_1_idx" ON "_branding_v" USING btree ("version_poses_celebrating_image2x_id");
  CREATE INDEX "_branding_v_version_poses_confused_version_poses_confuse_idx" ON "_branding_v" USING btree ("version_poses_confused_image_id");
  CREATE INDEX "_branding_v_version_poses_confused_version_poses_confu_1_idx" ON "_branding_v" USING btree ("version_poses_confused_image2x_id");
  CREATE INDEX "_branding_v_version_poses_tablet_version_poses_tablet_im_idx" ON "_branding_v" USING btree ("version_poses_tablet_image_id");
  CREATE INDEX "_branding_v_version_poses_tablet_version_poses_tablet__1_idx" ON "_branding_v" USING btree ("version_poses_tablet_image2x_id");
  CREATE INDEX "_branding_v_version_version_glb_model_idx" ON "_branding_v" USING btree ("version_glb_model_id");
  CREATE INDEX "_branding_v_created_at_idx" ON "_branding_v" USING btree ("created_at");
  CREATE INDEX "_branding_v_updated_at_idx" ON "_branding_v" USING btree ("updated_at");
  CREATE INDEX "_branding_v_rels_order_idx" ON "_branding_v_rels" USING btree ("order");
  CREATE INDEX "_branding_v_rels_parent_idx" ON "_branding_v_rels" USING btree ("parent_id");
  CREATE INDEX "_branding_v_rels_path_idx" ON "_branding_v_rels" USING btree ("path");
  CREATE INDEX "_branding_v_rels_admins_id_idx" ON "_branding_v_rels" USING btree ("admins_id");
  CREATE INDEX "navigation_header_children_order_idx" ON "navigation_header_children" USING btree ("_order");
  CREATE INDEX "navigation_header_children_parent_id_idx" ON "navigation_header_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_children_page_idx" ON "navigation_header_children" USING btree ("page_id");
  CREATE INDEX "navigation_header_children_post_idx" ON "navigation_header_children" USING btree ("post_id");
  CREATE INDEX "navigation_header_children_course_idx" ON "navigation_header_children" USING btree ("course_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_page_idx" ON "navigation_header" USING btree ("page_id");
  CREATE INDEX "navigation_header_post_idx" ON "navigation_header" USING btree ("post_id");
  CREATE INDEX "navigation_header_course_idx" ON "navigation_header" USING btree ("course_id");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_page_idx" ON "navigation_footer_columns_links" USING btree ("page_id");
  CREATE INDEX "navigation_footer_columns_links_post_idx" ON "navigation_footer_columns_links" USING btree ("post_id");
  CREATE INDEX "navigation_footer_columns_links_course_idx" ON "navigation_footer_columns_links" USING btree ("course_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_mobile_bar_items_order_idx" ON "navigation_mobile_bar_items" USING btree ("_order");
  CREATE INDEX "navigation_mobile_bar_items_parent_id_idx" ON "navigation_mobile_bar_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_cta_cta_brochure_file_idx" ON "navigation" USING btree ("cta_brochure_file_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_admins_id_idx" ON "navigation_rels" USING btree ("admins_id");
  CREATE INDEX "_navigation_v_version_header_children_order_idx" ON "_navigation_v_version_header_children" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_header_children_parent_id_idx" ON "_navigation_v_version_header_children" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_header_children_page_idx" ON "_navigation_v_version_header_children" USING btree ("page_id");
  CREATE INDEX "_navigation_v_version_header_children_post_idx" ON "_navigation_v_version_header_children" USING btree ("post_id");
  CREATE INDEX "_navigation_v_version_header_children_course_idx" ON "_navigation_v_version_header_children" USING btree ("course_id");
  CREATE INDEX "_navigation_v_version_header_order_idx" ON "_navigation_v_version_header" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_header_parent_id_idx" ON "_navigation_v_version_header" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_header_page_idx" ON "_navigation_v_version_header" USING btree ("page_id");
  CREATE INDEX "_navigation_v_version_header_post_idx" ON "_navigation_v_version_header" USING btree ("post_id");
  CREATE INDEX "_navigation_v_version_header_course_idx" ON "_navigation_v_version_header" USING btree ("course_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_order_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_links_parent_id_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_page_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("page_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_post_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("post_id");
  CREATE INDEX "_navigation_v_version_footer_columns_links_course_idx" ON "_navigation_v_version_footer_columns_links" USING btree ("course_id");
  CREATE INDEX "_navigation_v_version_footer_columns_order_idx" ON "_navigation_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_footer_columns_parent_id_idx" ON "_navigation_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_mobile_bar_items_order_idx" ON "_navigation_v_version_mobile_bar_items" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_mobile_bar_items_parent_id_idx" ON "_navigation_v_version_mobile_bar_items" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_cta_version_cta_brochure_file_idx" ON "_navigation_v" USING btree ("version_cta_brochure_file_id");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_rels_order_idx" ON "_navigation_v_rels" USING btree ("order");
  CREATE INDEX "_navigation_v_rels_parent_idx" ON "_navigation_v_rels" USING btree ("parent_id");
  CREATE INDEX "_navigation_v_rels_path_idx" ON "_navigation_v_rels" USING btree ("path");
  CREATE INDEX "_navigation_v_rels_admins_id_idx" ON "_navigation_v_rels" USING btree ("admins_id");
  CREATE INDEX "pmb_settings_requirements_order_idx" ON "pmb_settings_requirements" USING btree ("_order");
  CREATE INDEX "pmb_settings_requirements_parent_id_idx" ON "pmb_settings_requirements" USING btree ("_parent_id");
  CREATE INDEX "pmb_settings_fees_order_idx" ON "pmb_settings_fees" USING btree ("_order");
  CREATE INDEX "pmb_settings_fees_parent_id_idx" ON "pmb_settings_fees" USING btree ("_parent_id");
  CREATE INDEX "pmb_settings_steps_order_idx" ON "pmb_settings_steps" USING btree ("_order");
  CREATE INDEX "pmb_settings_steps_parent_id_idx" ON "pmb_settings_steps" USING btree ("_parent_id");
  CREATE INDEX "pmb_settings_source_options_order_idx" ON "pmb_settings_source_options" USING btree ("_order");
  CREATE INDEX "pmb_settings_source_options_parent_id_idx" ON "pmb_settings_source_options" USING btree ("_parent_id");
  CREATE INDEX "pmb_settings_rels_order_idx" ON "pmb_settings_rels" USING btree ("order");
  CREATE INDEX "pmb_settings_rels_parent_idx" ON "pmb_settings_rels" USING btree ("parent_id");
  CREATE INDEX "pmb_settings_rels_path_idx" ON "pmb_settings_rels" USING btree ("path");
  CREATE INDEX "pmb_settings_rels_admins_id_idx" ON "pmb_settings_rels" USING btree ("admins_id");
  CREATE INDEX "_pmb_settings_v_version_requirements_order_idx" ON "_pmb_settings_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_pmb_settings_v_version_requirements_parent_id_idx" ON "_pmb_settings_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_pmb_settings_v_version_fees_order_idx" ON "_pmb_settings_v_version_fees" USING btree ("_order");
  CREATE INDEX "_pmb_settings_v_version_fees_parent_id_idx" ON "_pmb_settings_v_version_fees" USING btree ("_parent_id");
  CREATE INDEX "_pmb_settings_v_version_steps_order_idx" ON "_pmb_settings_v_version_steps" USING btree ("_order");
  CREATE INDEX "_pmb_settings_v_version_steps_parent_id_idx" ON "_pmb_settings_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_pmb_settings_v_version_source_options_order_idx" ON "_pmb_settings_v_version_source_options" USING btree ("_order");
  CREATE INDEX "_pmb_settings_v_version_source_options_parent_id_idx" ON "_pmb_settings_v_version_source_options" USING btree ("_parent_id");
  CREATE INDEX "_pmb_settings_v_created_at_idx" ON "_pmb_settings_v" USING btree ("created_at");
  CREATE INDEX "_pmb_settings_v_updated_at_idx" ON "_pmb_settings_v" USING btree ("updated_at");
  CREATE INDEX "_pmb_settings_v_rels_order_idx" ON "_pmb_settings_v_rels" USING btree ("order");
  CREATE INDEX "_pmb_settings_v_rels_parent_idx" ON "_pmb_settings_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pmb_settings_v_rels_path_idx" ON "_pmb_settings_v_rels" USING btree ("path");
  CREATE INDEX "_pmb_settings_v_rels_admins_id_idx" ON "_pmb_settings_v_rels" USING btree ("admins_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_rotating_words" CASCADE;
  DROP TABLE "pages_blocks_hero_orbit_chips" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_page_header_actions" CASCADE;
  DROP TABLE "pages_blocks_page_header" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_why_mbd_cards" CASCADE;
  DROP TABLE "pages_blocks_why_mbd" CASCADE;
  DROP TABLE "pages_blocks_curriculum_track" CASCADE;
  DROP TABLE "pages_blocks_curriculum_explorer" CASCADE;
  DROP TABLE "pages_blocks_faculty_highlight" CASCADE;
  DROP TABLE "pages_blocks_faculty_directory" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_latest_posts" CASCADE;
  DROP TABLE "pages_blocks_blog_index" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_marquee_words" CASCADE;
  DROP TABLE "pages_blocks_marquee" CASCADE;
  DROP TABLE "pages_blocks_form_embed" CASCADE;
  DROP TABLE "pages_blocks_programs" CASCADE;
  DROP TABLE "pages_blocks_career_paths" CASCADE;
  DROP TABLE "pages_blocks_job_board" CASCADE;
  DROP TABLE "pages_blocks_pmb_info" CASCADE;
  DROP TABLE "pages_blocks_quiz_bands" CASCADE;
  DROP TABLE "pages_blocks_quiz" CASCADE;
  DROP TABLE "pages_blocks_contact_info" CASCADE;
  DROP TABLE "pages_blocks_not_found_hero_quick_links" CASCADE;
  DROP TABLE "pages_blocks_not_found_hero" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_rotating_words" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_orbit_chips" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header_actions" CASCADE;
  DROP TABLE "_pages_v_blocks_page_header" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_why_mbd_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_why_mbd" CASCADE;
  DROP TABLE "_pages_v_blocks_curriculum_track" CASCADE;
  DROP TABLE "_pages_v_blocks_curriculum_explorer" CASCADE;
  DROP TABLE "_pages_v_blocks_faculty_highlight" CASCADE;
  DROP TABLE "_pages_v_blocks_faculty_directory" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_posts" CASCADE;
  DROP TABLE "_pages_v_blocks_blog_index" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee_words" CASCADE;
  DROP TABLE "_pages_v_blocks_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_form_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_programs" CASCADE;
  DROP TABLE "_pages_v_blocks_career_paths" CASCADE;
  DROP TABLE "_pages_v_blocks_job_board" CASCADE;
  DROP TABLE "_pages_v_blocks_pmb_info" CASCADE;
  DROP TABLE "_pages_v_blocks_quiz_bands" CASCADE;
  DROP TABLE "_pages_v_blocks_quiz" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_info" CASCADE;
  DROP TABLE "_pages_v_blocks_not_found_hero_quick_links" CASCADE;
  DROP TABLE "_pages_v_blocks_not_found_hero" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "post_categories_rels" CASCADE;
  DROP TABLE "_post_categories_v" CASCADE;
  DROP TABLE "_post_categories_v_rels" CASCADE;
  DROP TABLE "post_tags" CASCADE;
  DROP TABLE "post_tags_rels" CASCADE;
  DROP TABLE "_post_tags_v" CASCADE;
  DROP TABLE "_post_tags_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_rels" CASCADE;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_media_v_rels" CASCADE;
  DROP TABLE "folders" CASCADE;
  DROP TABLE "folders_rels" CASCADE;
  DROP TABLE "_folders_v" CASCADE;
  DROP TABLE "_folders_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_rels" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_tags_v_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_rels" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_rels" CASCADE;
  DROP TABLE "career_paths" CASCADE;
  DROP TABLE "career_paths_texts" CASCADE;
  DROP TABLE "career_paths_rels" CASCADE;
  DROP TABLE "_career_paths_v" CASCADE;
  DROP TABLE "_career_paths_v_texts" CASCADE;
  DROP TABLE "_career_paths_v_rels" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partners_rels" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_rels" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_rels" CASCADE;
  DROP TABLE "_programs_v" CASCADE;
  DROP TABLE "_programs_v_rels" CASCADE;
  DROP TABLE "job_posts" CASCADE;
  DROP TABLE "job_posts_rels" CASCADE;
  DROP TABLE "_job_posts_v" CASCADE;
  DROP TABLE "_job_posts_v_rels" CASCADE;
  DROP TABLE "faqs_scope" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_rels" CASCADE;
  DROP TABLE "_faqs_v_version_scope" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  DROP TABLE "_faqs_v_rels" CASCADE;
  DROP TABLE "curriculum_versions_semesters" CASCADE;
  DROP TABLE "curriculum_versions" CASCADE;
  DROP TABLE "curriculum_versions_rels" CASCADE;
  DROP TABLE "_curriculum_versions_v_version_semesters" CASCADE;
  DROP TABLE "_curriculum_versions_v" CASCADE;
  DROP TABLE "_curriculum_versions_v_rels" CASCADE;
  DROP TABLE "courses_tags" CASCADE;
  DROP TABLE "courses_cpmk" CASCADE;
  DROP TABLE "courses_weekly_plan" CASCADE;
  DROP TABLE "courses_assessment" CASCADE;
  DROP TABLE "courses_references" CASCADE;
  DROP TABLE "courses_tools" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_locales" CASCADE;
  DROP TABLE "courses_rels" CASCADE;
  DROP TABLE "_courses_v_version_tags" CASCADE;
  DROP TABLE "_courses_v_version_cpmk" CASCADE;
  DROP TABLE "_courses_v_version_weekly_plan" CASCADE;
  DROP TABLE "_courses_v_version_assessment" CASCADE;
  DROP TABLE "_courses_v_version_references" CASCADE;
  DROP TABLE "_courses_v_version_tools" CASCADE;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "_courses_v_locales" CASCADE;
  DROP TABLE "_courses_v_rels" CASCADE;
  DROP TABLE "faculty_education" CASCADE;
  DROP TABLE "faculty_publications" CASCADE;
  DROP TABLE "faculty" CASCADE;
  DROP TABLE "faculty_locales" CASCADE;
  DROP TABLE "faculty_texts" CASCADE;
  DROP TABLE "faculty_rels" CASCADE;
  DROP TABLE "_faculty_v_version_education" CASCADE;
  DROP TABLE "_faculty_v_version_publications" CASCADE;
  DROP TABLE "_faculty_v" CASCADE;
  DROP TABLE "_faculty_v_locales" CASCADE;
  DROP TABLE "_faculty_v_texts" CASCADE;
  DROP TABLE "_faculty_v_rels" CASCADE;
  DROP TABLE "pmb_applications_notes" CASCADE;
  DROP TABLE "pmb_applications_status_history" CASCADE;
  DROP TABLE "pmb_applications" CASCADE;
  DROP TABLE "pmb_applications_rels" CASCADE;
  DROP TABLE "_pmb_applications_v_version_notes" CASCADE;
  DROP TABLE "_pmb_applications_v_version_status_history" CASCADE;
  DROP TABLE "_pmb_applications_v" CASCADE;
  DROP TABLE "_pmb_applications_v_rels" CASCADE;
  DROP TABLE "leads_sources" CASCADE;
  DROP TABLE "leads_notes" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "leads_texts" CASCADE;
  DROP TABLE "leads_rels" CASCADE;
  DROP TABLE "_leads_v_version_sources" CASCADE;
  DROP TABLE "_leads_v_version_notes" CASCADE;
  DROP TABLE "_leads_v" CASCADE;
  DROP TABLE "_leads_v_texts" CASCADE;
  DROP TABLE "_leads_v_rels" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "contact_messages_rels" CASCADE;
  DROP TABLE "_contact_messages_v" CASCADE;
  DROP TABLE "_contact_messages_v_rels" CASCADE;
  DROP TABLE "pmb_waves" CASCADE;
  DROP TABLE "pmb_waves_rels" CASCADE;
  DROP TABLE "_pmb_waves_v" CASCADE;
  DROP TABLE "_pmb_waves_v_rels" CASCADE;
  DROP TABLE "pmb_tracks_highlights" CASCADE;
  DROP TABLE "pmb_tracks" CASCADE;
  DROP TABLE "pmb_tracks_rels" CASCADE;
  DROP TABLE "_pmb_tracks_v_version_highlights" CASCADE;
  DROP TABLE "_pmb_tracks_v" CASCADE;
  DROP TABLE "_pmb_tracks_v_rels" CASCADE;
  DROP TABLE "message_templates" CASCADE;
  DROP TABLE "message_templates_rels" CASCADE;
  DROP TABLE "_message_templates_v" CASCADE;
  DROP TABLE "_message_templates_v_rels" CASCADE;
  DROP TABLE "pmb_documents" CASCADE;
  DROP TABLE "pmb_documents_rels" CASCADE;
  DROP TABLE "_pmb_documents_v" CASCADE;
  DROP TABLE "_pmb_documents_v_rels" CASCADE;
  DROP TABLE "quiz_questions_options" CASCADE;
  DROP TABLE "quiz_questions" CASCADE;
  DROP TABLE "quiz_questions_rels" CASCADE;
  DROP TABLE "_quiz_questions_v_version_options" CASCADE;
  DROP TABLE "_quiz_questions_v" CASCADE;
  DROP TABLE "_quiz_questions_v_rels" CASCADE;
  DROP TABLE "quiz_results_semesters" CASCADE;
  DROP TABLE "quiz_results" CASCADE;
  DROP TABLE "quiz_results_texts" CASCADE;
  DROP TABLE "quiz_results_rels" CASCADE;
  DROP TABLE "_quiz_results_v_version_semesters" CASCADE;
  DROP TABLE "_quiz_results_v" CASCADE;
  DROP TABLE "_quiz_results_v_texts" CASCADE;
  DROP TABLE "_quiz_results_v_rels" CASCADE;
  DROP TABLE "quiz_attempts" CASCADE;
  DROP TABLE "quiz_attempts_rels" CASCADE;
  DROP TABLE "_quiz_attempts_v" CASCADE;
  DROP TABLE "_quiz_attempts_v_rels" CASCADE;
  DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "admins_rels" CASCADE;
  DROP TABLE "roles" CASCADE;
  DROP TABLE "roles_rels" CASCADE;
  DROP TABLE "_roles_v" CASCADE;
  DROP TABLE "_roles_v_rels" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "_redirects_v" CASCADE;
  DROP TABLE "_redirects_v_rels" CASCADE;
  DROP TABLE "not_found_logs" CASCADE;
  DROP TABLE "not_found_logs_rels" CASCADE;
  DROP TABLE "_not_found_logs_v" CASCADE;
  DROP TABLE "_not_found_logs_v_rels" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "audit_logs_rels" CASCADE;
  DROP TABLE "_audit_logs_v" CASCADE;
  DROP TABLE "_audit_logs_v_rels" CASCADE;
  DROP TABLE "analytics_events" CASCADE;
  DROP TABLE "analytics_events_rels" CASCADE;
  DROP TABLE "_analytics_events_v" CASCADE;
  DROP TABLE "_analytics_events_v_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_llm_instructions" CASCADE;
  DROP TABLE "payload_llm_instructions_rels" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "_site_settings_v_version_socials" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_rels" CASCADE;
  DROP TABLE "branding_lines" CASCADE;
  DROP TABLE "branding" CASCADE;
  DROP TABLE "branding_rels" CASCADE;
  DROP TABLE "_branding_v_version_lines" CASCADE;
  DROP TABLE "_branding_v" CASCADE;
  DROP TABLE "_branding_v_rels" CASCADE;
  DROP TABLE "navigation_header_children" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation_mobile_bar_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "_navigation_v_version_header_children" CASCADE;
  DROP TABLE "_navigation_v_version_header" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_navigation_v_version_footer_columns" CASCADE;
  DROP TABLE "_navigation_v_version_mobile_bar_items" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "_navigation_v_rels" CASCADE;
  DROP TABLE "pmb_settings_requirements" CASCADE;
  DROP TABLE "pmb_settings_fees" CASCADE;
  DROP TABLE "pmb_settings_steps" CASCADE;
  DROP TABLE "pmb_settings_source_options" CASCADE;
  DROP TABLE "pmb_settings" CASCADE;
  DROP TABLE "pmb_settings_rels" CASCADE;
  DROP TABLE "_pmb_settings_v_version_requirements" CASCADE;
  DROP TABLE "_pmb_settings_v_version_fees" CASCADE;
  DROP TABLE "_pmb_settings_v_version_steps" CASCADE;
  DROP TABLE "_pmb_settings_v_version_source_options" CASCADE;
  DROP TABLE "_pmb_settings_v" CASCADE;
  DROP TABLE "_pmb_settings_v_rels" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_hero_mascot_pose";
  DROP TYPE "public"."enum_pages_blocks_page_header_actions_kind";
  DROP TYPE "public"."enum_pages_blocks_page_header_mascot_pose";
  DROP TYPE "public"."enum_pages_blocks_stats_items_source";
  DROP TYPE "public"."enum_pages_blocks_why_mbd_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_why_mbd_cards_size";
  DROP TYPE "public"."enum_pages_blocks_cta_band_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_band_mascot_pose";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_image_text_mascot_pose";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_faq_scope";
  DROP TYPE "public"."enum_pages_blocks_card_grid_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_card_grid_style";
  DROP TYPE "public"."enum_pages_blocks_card_grid_mascot_pose";
  DROP TYPE "public"."enum_pages_blocks_marquee_source";
  DROP TYPE "public"."enum_pages_blocks_marquee_tone";
  DROP TYPE "public"."enum_pages_blocks_form_embed_form";
  DROP TYPE "public"."enum_pages_blocks_form_embed_mascot_pose";
  DROP TYPE "public"."enum_pages_blocks_pmb_info_section";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_review_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_mascot_pose";
  DROP TYPE "public"."enum__pages_v_blocks_page_header_actions_kind";
  DROP TYPE "public"."enum__pages_v_blocks_page_header_mascot_pose";
  DROP TYPE "public"."enum__pages_v_blocks_stats_items_source";
  DROP TYPE "public"."enum__pages_v_blocks_why_mbd_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_why_mbd_cards_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_mascot_pose";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_mascot_pose";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_faq_scope";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_style";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_mascot_pose";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_source";
  DROP TYPE "public"."enum__pages_v_blocks_marquee_tone";
  DROP TYPE "public"."enum__pages_v_blocks_form_embed_form";
  DROP TYPE "public"."enum__pages_v_blocks_form_embed_mascot_pose";
  DROP TYPE "public"."enum__pages_v_blocks_pmb_info_section";
  DROP TYPE "public"."enum__pages_v_version_template";
  DROP TYPE "public"."enum__pages_v_version_review_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_review_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_review_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_career_paths_icon";
  DROP TYPE "public"."enum__career_paths_v_version_icon";
  DROP TYPE "public"."enum_partners_kind";
  DROP TYPE "public"."enum__partners_v_version_kind";
  DROP TYPE "public"."enum_programs_mascot_pose";
  DROP TYPE "public"."enum_programs_icon";
  DROP TYPE "public"."enum__programs_v_version_mascot_pose";
  DROP TYPE "public"."enum__programs_v_version_icon";
  DROP TYPE "public"."enum_job_posts_type";
  DROP TYPE "public"."enum__job_posts_v_version_type";
  DROP TYPE "public"."enum_faqs_scope";
  DROP TYPE "public"."enum__faqs_v_version_scope";
  DROP TYPE "public"."enum_curriculum_versions_status";
  DROP TYPE "public"."enum__curriculum_versions_v_version_status";
  DROP TYPE "public"."enum_courses_tags";
  DROP TYPE "public"."enum_courses_type";
  DROP TYPE "public"."enum__courses_v_version_tags";
  DROP TYPE "public"."enum__courses_v_version_type";
  DROP TYPE "public"."enum_faculty_status";
  DROP TYPE "public"."enum__faculty_v_published_locale";
  DROP TYPE "public"."enum__faculty_v_version_status";
  DROP TYPE "public"."enum_pmb_applications_status_history_from_status";
  DROP TYPE "public"."enum_pmb_applications_status_history_to_status";
  DROP TYPE "public"."enum_pmb_applications_status";
  DROP TYPE "public"."enum__pmb_applications_v_version_status_history_from_status";
  DROP TYPE "public"."enum__pmb_applications_v_version_status_history_to_status";
  DROP TYPE "public"."enum__pmb_applications_v_version_status";
  DROP TYPE "public"."enum_leads_sources";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_first_source";
  DROP TYPE "public"."enum__leads_v_version_sources";
  DROP TYPE "public"."enum__leads_v_version_status";
  DROP TYPE "public"."enum__leads_v_version_first_source";
  DROP TYPE "public"."enum_contact_messages_kind";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_contact_messages_topic";
  DROP TYPE "public"."enum_contact_messages_time_slot";
  DROP TYPE "public"."enum__contact_messages_v_version_kind";
  DROP TYPE "public"."enum__contact_messages_v_version_status";
  DROP TYPE "public"."enum__contact_messages_v_version_topic";
  DROP TYPE "public"."enum__contact_messages_v_version_time_slot";
  DROP TYPE "public"."enum_pmb_waves_status";
  DROP TYPE "public"."enum__pmb_waves_v_version_status";
  DROP TYPE "public"."enum_message_templates_channel";
  DROP TYPE "public"."enum_message_templates_status_key";
  DROP TYPE "public"."enum__message_templates_v_version_channel";
  DROP TYPE "public"."enum__message_templates_v_version_status_key";
  DROP TYPE "public"."enum_pmb_documents_type";
  DROP TYPE "public"."enum__pmb_documents_v_version_type";
  DROP TYPE "public"."enum_quiz_results_semesters";
  DROP TYPE "public"."enum_quiz_results_pair_key";
  DROP TYPE "public"."enum_quiz_results_pose";
  DROP TYPE "public"."enum__quiz_results_v_version_semesters";
  DROP TYPE "public"."enum__quiz_results_v_version_pair_key";
  DROP TYPE "public"."enum__quiz_results_v_version_pose";
  DROP TYPE "public"."enum_admins_status";
  DROP TYPE "public"."enum_redirects_status_code";
  DROP TYPE "public"."enum__redirects_v_version_status_code";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum__audit_logs_v_version_action";
  DROP TYPE "public"."enum_analytics_events_name";
  DROP TYPE "public"."enum__analytics_events_v_version_name";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_log_parent_task_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_llm_instructions_entity_type";
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum__site_settings_v_version_socials_platform";
  DROP TYPE "public"."enum_branding_lines_pose";
  DROP TYPE "public"."enum__branding_v_version_lines_pose";
  DROP TYPE "public"."enum_navigation_header_children_link_type";
  DROP TYPE "public"."enum_navigation_header_link_type";
  DROP TYPE "public"."enum_navigation_footer_columns_links_link_type";
  DROP TYPE "public"."enum_navigation_mobile_bar_items_kind";
  DROP TYPE "public"."enum__navigation_v_version_header_children_link_type";
  DROP TYPE "public"."enum__navigation_v_version_header_link_type";
  DROP TYPE "public"."enum__navigation_v_version_footer_columns_links_link_type";
  DROP TYPE "public"."enum__navigation_v_version_mobile_bar_items_kind";`)
}
