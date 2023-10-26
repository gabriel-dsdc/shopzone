import { Schema, Model, model, models } from "mongoose";

export abstract class AbstractModel<T> {
  public model: Model<T>;

  constructor(modelName: string, schema: Schema) {
    schema.set("timestamps", true);
    this.model = models[modelName] || model<T>(modelName, schema);
  }
}
