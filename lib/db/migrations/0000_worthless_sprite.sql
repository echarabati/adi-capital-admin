CREATE TYPE "public"."base_admin_fee" AS ENUM('compromiso', 'aportado');--> statement-breakpoint
CREATE TYPE "public"."concepto" AS ENUM('APO', 'APO-D', 'DIS', 'DEV', 'FEE', 'INV', 'INV-D', 'RET', 'GAS', 'GASP', 'APS', 'RPS', 'PRS', 'DPRS', 'TRA', 'CAM', 'ERR', 'TSI');--> statement-breakpoint
CREATE TYPE "public"."estado_call" AS ENUM('pendiente', 'parcial', 'completo');--> statement-breakpoint
CREATE TYPE "public"."estado_movimiento" AS ENUM('borrador', 'confirmado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."estado_proyecto" AS ENUM('inversion_abierta', 'inversion_cerrada', 'concluido');--> statement-breakpoint
CREATE TYPE "public"."metodo_admin_fee" AS ENUM('capital_call_independiente', 'incluido_en_capital_call');--> statement-breakpoint
CREATE TYPE "public"."metodo_cascada" AS ENUM('pref_primero', 'capital_primero');--> statement-breakpoint
CREATE TYPE "public"."moneda" AS ENUM('MXN', 'USD', 'EUR', 'ILS');--> statement-breakpoint
CREATE TYPE "public"."rol_usuario" AS ENUM('super_admin', 'admin_fondo', 'agente');--> statement-breakpoint
CREATE TYPE "public"."tipo_admin_fee" AS ENUM('one_time', 'anual');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"role" "rol_usuario" DEFAULT 'admin_fondo' NOT NULL,
	"password" text,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "invite_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"invited_by" uuid,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "invite_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"event" text NOT NULL,
	"user_id" uuid,
	"email" text,
	"ip_address" text,
	"user_agent" text,
	"metadata" text
);
--> statement-breakpoint
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
	"estado" "estado_proyecto" DEFAULT 'inversion_abierta' NOT NULL,
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
CREATE TABLE "movimientos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fondo_id" uuid NOT NULL,
	"proyecto_id" uuid,
	"inversionista_id" uuid,
	"inversion_id" uuid,
	"beneficiario_id" uuid,
	"cuenta_id" uuid,
	"concepto" "concepto" NOT NULL,
	"monto" numeric(18, 2) NOT NULL,
	"moneda" "moneda" NOT NULL,
	"tipo_cambio" numeric(10, 4),
	"monto_usd" numeric(18, 2),
	"estado" "estado_movimiento" DEFAULT 'borrador' NOT NULL,
	"fecha_movimiento" timestamp with time zone NOT NULL,
	"fecha_confirmacion" timestamp with time zone,
	"grupo_movimiento" uuid,
	"descripcion" text,
	"sincronizado_firebase" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid
);
--> statement-breakpoint
CREATE TABLE "calendario_pagos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inversion_id" uuid NOT NULL,
	"numero" integer NOT NULL,
	"fecha_programada" timestamp with time zone NOT NULL,
	"monto_esperado" numeric(18, 2) NOT NULL,
	"monto_pagado" numeric(18, 2) DEFAULT '0',
	"estado" "estado_call" DEFAULT 'pendiente' NOT NULL,
	"notas" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "calendario_pagos_unique" UNIQUE("inversion_id","numero")
);
--> statement-breakpoint
CREATE TABLE "cuentas_bancarias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fondo_id" uuid NOT NULL,
	"banco" text NOT NULL,
	"numero" text NOT NULL,
	"clabe" text,
	"moneda" "moneda" NOT NULL,
	"saldo" numeric(18, 2) DEFAULT '0',
	"activa" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "cuentas_bancarias_unique" UNIQUE("fondo_id","numero")
);
--> statement-breakpoint
CREATE TABLE "beneficiarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fondo_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"banco" text,
	"numero_cuenta" text,
	"clabe" text,
	"notas" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by" uuid,
	CONSTRAINT "beneficiarios_unique" UNIQUE("fondo_id","nombre")
);
--> statement-breakpoint
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
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversionistas_fondos" ADD CONSTRAINT "inversionistas_fondos_inversionista_id_inversionistas_id_fk" FOREIGN KEY ("inversionista_id") REFERENCES "public"."inversionistas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversionistas_fondos" ADD CONSTRAINT "inversionistas_fondos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversiones" ADD CONSTRAINT "inversiones_inversionista_id_inversionistas_id_fk" FOREIGN KEY ("inversionista_id") REFERENCES "public"."inversionistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inversiones" ADD CONSTRAINT "inversiones_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_inversionista_id_inversionistas_id_fk" FOREIGN KEY ("inversionista_id") REFERENCES "public"."inversionistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_inversion_id_inversiones_id_fk" FOREIGN KEY ("inversion_id") REFERENCES "public"."inversiones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_beneficiario_id_beneficiarios_id_fk" FOREIGN KEY ("beneficiario_id") REFERENCES "public"."beneficiarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_cuenta_id_cuentas_bancarias_id_fk" FOREIGN KEY ("cuenta_id") REFERENCES "public"."cuentas_bancarias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendario_pagos" ADD CONSTRAINT "calendario_pagos_inversion_id_inversiones_id_fk" FOREIGN KEY ("inversion_id") REFERENCES "public"."inversiones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_bancarias" ADD CONSTRAINT "cuentas_bancarias_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beneficiarios" ADD CONSTRAINT "beneficiarios_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_fondos" ADD CONSTRAINT "user_fondos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_fondos" ADD CONSTRAINT "user_fondos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "proyectos_fondo_id_idx" ON "proyectos" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "inversionistas_fondos_inversionista_id_idx" ON "inversionistas_fondos" USING btree ("inversionista_id");--> statement-breakpoint
CREATE INDEX "inversionistas_fondos_fondo_id_idx" ON "inversionistas_fondos" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "inversiones_inversionista_id_idx" ON "inversiones" USING btree ("inversionista_id");--> statement-breakpoint
CREATE INDEX "inversiones_proyecto_id_idx" ON "inversiones" USING btree ("proyecto_id");--> statement-breakpoint
CREATE INDEX "movimientos_fondo_id_idx" ON "movimientos" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "movimientos_proyecto_id_idx" ON "movimientos" USING btree ("proyecto_id");--> statement-breakpoint
CREATE INDEX "movimientos_inversionista_id_idx" ON "movimientos" USING btree ("inversionista_id");--> statement-breakpoint
CREATE INDEX "movimientos_inversion_id_idx" ON "movimientos" USING btree ("inversion_id");--> statement-breakpoint
CREATE INDEX "movimientos_concepto_idx" ON "movimientos" USING btree ("concepto");--> statement-breakpoint
CREATE INDEX "movimientos_estado_idx" ON "movimientos" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "movimientos_fecha_idx" ON "movimientos" USING btree ("fecha_movimiento");--> statement-breakpoint
CREATE INDEX "movimientos_grupo_idx" ON "movimientos" USING btree ("grupo_movimiento");--> statement-breakpoint
CREATE INDEX "calendario_pagos_inversion_id_idx" ON "calendario_pagos" USING btree ("inversion_id");--> statement-breakpoint
CREATE INDEX "cuentas_bancarias_fondo_id_idx" ON "cuentas_bancarias" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "beneficiarios_fondo_id_idx" ON "beneficiarios" USING btree ("fondo_id");--> statement-breakpoint
CREATE INDEX "user_fondos_user_id_idx" ON "user_fondos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_fondos_fondo_id_idx" ON "user_fondos" USING btree ("fondo_id");