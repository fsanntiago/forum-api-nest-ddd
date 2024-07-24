import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<EntityProps> {
  private _id: UniqueEntityID

  protected readonly props: EntityProps

  get id() {
    return this._id
  }

  protected constructor(props: EntityProps, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  equals(entity: Entity<any>) {
    if (entity.id === this._id) {
      return true
    }

    if (entity === this) {
      return true
    }

    return false
  }
}
