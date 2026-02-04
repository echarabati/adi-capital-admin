CREATE TYPE "public"."concepto" AS ENUM('APO', 'APO-D', 'DIS', 'DEV', 'FEE', 'INV', 'INV-D', 'RET', 'GAS', 'GASP', 'APS', 'RPS', 'PRS', 'DPRS', 'TRA', 'CAM', 'ERR', 'TSI');--> statement-breakpoint
CREATE TYPE "public"."estado_call" AS ENUM('pendiente', 'parcial', 'completo');--> statement-breakpoint
CREATE TYPE "public"."estado_movimiento" AS ENUM('borrador', 'confirmado', 'cancelado');--> statement-breakpoint
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
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_inversionista_id_inversionistas_id_fk" FOREIGN KEY ("inversionista_id") REFERENCES "public"."inversionistas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_inversion_id_inversiones_id_fk" FOREIGN KEY ("inversion_id") REFERENCES "public"."inversiones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_beneficiario_id_beneficiarios_id_fk" FOREIGN KEY ("beneficiario_id") REFERENCES "public"."beneficiarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_cuenta_id_cuentas_bancarias_id_fk" FOREIGN KEY ("cuenta_id") REFERENCES "public"."cuentas_bancarias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendario_pagos" ADD CONSTRAINT "calendario_pagos_inversion_id_inversiones_id_fk" FOREIGN KEY ("inversion_id") REFERENCES "public"."inversiones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cuentas_bancarias" ADD CONSTRAINT "cuentas_bancarias_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beneficiarios" ADD CONSTRAINT "beneficiarios_fondo_id_fondos_id_fk" FOREIGN KEY ("fondo_id") REFERENCES "public"."fondos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
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
CREATE INDEX "beneficiarios_fondo_id_idx" ON "beneficiarios" USING btree ("fondo_id");