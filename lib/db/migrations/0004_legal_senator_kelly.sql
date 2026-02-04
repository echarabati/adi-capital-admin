CREATE TYPE "public"."rol_usuario" AS ENUM('super_admin', 'admin_fondo', 'agente');--> statement-breakpoint
CREATE TABLE "user_fondos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"fondo_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "user_fondos_unique" UNIQUE("user_id","fondo_id")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'admin_fondo'::"public"."rol_usuario";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."rol_usuario" USING "role"::"public"."rol_usuario";--> statement-breakpoint
ALTER TABLE "user_fondos" ADD CONSTRAINT "user_fondos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_fondos" ADD CONSTRAINT "user_fondos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_fondos_user_id_idx" ON "user_fondos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_fondos_fondo_id_idx" ON "user_fondos" USING btree ("fondo_id");