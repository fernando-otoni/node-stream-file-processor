import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadEntity } from "../entity/upload.entity";
import { Repository } from "typeorm";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly repository: Repository<UploadEntity>
  ) {}

  async create(data: Partial<UploadEntity>): Promise<UploadEntity> {
    const upload = this.repository.create(data)

    return this.repository.save(upload)
  }

  async findByHash(hash: string): Promise<UploadEntity | null> {
    return this.repository.findOne({
      where: { hash }
    })
  }

  async update(data: Partial<UploadEntity>, id: number) {
    return this.repository.update(id, {
      ...data
    })
  }
}