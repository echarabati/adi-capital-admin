CREATE TYPE "public"."base_admin_fee" AS ENUM('compromiso', 'aportado');--> statement-breakpoint
CREATE TYPE "public"."estado_proyecto" AS ENUM('activo', 'cerrado', 'en_desarrollo');--> statement-breakpoint
CREATE TYPE "public"."metodo_admin_fee" AS ENUM('capital_call_independiente', 'incluido_en_capital_call');--> statement-breakpoint
CREATE TYPE "public"."metodo_cascada" AS ENUM('pref_primero', 'capital_primero');--> statement-breakpoint
CREATE TYPE "public"."moneda" AS ENUM('MXN', 'USD', 'EUR', 'ILS');--> statement-breakpoint
CREATE TYPE "public"."tipo_admin_fee" AS ENUM('one_time', 'anual');--> statement-breakpoint
CREATE TABLE "fondos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"moneda_base" "moneda" DEFAULT 'MXN' NOT NULL,
	"metodo_cascada" "metodo_cascada" DEFAULT 'pref_primero' NOT NULL,
	"success_fee_default" numeric(5, 2) DEFAULT '20',
	"pref_rate_default" numeric(5, 2) DEFAULT '12',
	"capital_socios" numeric(18, 2) DEFAULT '0',
	"activo" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid
);
--> statement-breakpoint
CREATE TABLE "proyectos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fondo_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text,
	"estado" "estado_proyecto" DEFAULT 'activo' NOT NULL,
	"metodo_cascada" "metodo_cascada",
	"success_fee_pct" numeric(5, 2),
	"inversion_recibida" numeric(18, 2) DEFAULT '0',
	"gastos" numeric(18, 2) DEFAULT '0',
	"retornos" numeric(18, 2) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid
);
--> statement-breakpoint
CREATE TABLE "inversionistas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"email" text,
	"telefono" text,
	"rfc" text,
	"notas" text,
	"es_fundador" boolean DEFAULT false,
	"agente_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid
);
--> statement-breakpoint
CREATE TABLE "inversionistas_fondos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inversionista_id" uuid NOT NULL,
	"fondo_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "inversionistas_fondos_unique" UNIQUE("inversionista_id","fondo_id")
);
--> statement-breakpoint
CREATE TABLE "inversiones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inversionista_id" uuid NOT NULL,
	"proyecto_id" uuid NOT NULL,
	"compromiso" numeric(18, 2) NOT NULL,
	"pref_rate" numeric(5, 2),
	"success_fee_pct" numeric(5, 2),
	"admin_fee_tipo" "tipo_admin_fee",
	"admin_fee_base" "base_admin_fee",
	"admin_fee_metodo" "metodo_admin_fee",
	"admin_fee_pct" numeric(5, 2),
	"capital_aportado" numeric(18, 2) DEFAULT '0',
	"pref_acumulado" numeric(18, 2) DEFAULT '0',
	"pref_pagado" numeric(18, 2) DEFAULT '0',
	"notas" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "inversiones_unique" UNIQUE("inversionista_id","proyecto_id")
);
--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversionistas_fondos" ADD CONSTRAINT "inversionistas_fondos_inversionista_id_inversionistas_id_fk" FOREIGN KEY ("inversionista_id") REFERENCES "public"."inversionistas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversionistas_fondos" ADD CONSTRAINT "inversionistas_fondos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversiones" ADD CONSTRAINT "inversiones_inversionista_id_inversionistas_id_fk" FOREIGN KEY ("inversionista_id") REFERENCES "public"."inversionistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversiones" ADD CONSTRAINT "inversiones_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "proyectos_fondo_id_idx" ON "proyectos" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "inversionistas_fondos_inversionista_id_idx" ON "inversionistas_fondos" USING btree ("inversionista_id");--> statement-breakpoint
CREATE INDEX "inversionistas_fondos_fondo_id_idx" ON "inversionistas_fondos" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "inversiones_inversionista_id_idx" ON "inversiones" USING btree ("inversionista_id");--> statement-breakpoint
CREATE INDEX "inversiones_proyecto_id_idx" ON "inversiones" USING btree ("proyecto_id");