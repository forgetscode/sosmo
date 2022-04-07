import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1649313955781 implements MigrationInterface {
    name = 'Initial1649313955781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying DEFAULT 'null', "publicKey" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "reputation" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_cb86c3c9d822da3e00a082f5878" UNIQUE ("publicKey"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "text" character varying NOT NULL, "discriminator" character varying NOT NULL, "state" character varying NOT NULL DEFAULT 'uninitialized', "disputeReason" character varying, "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
