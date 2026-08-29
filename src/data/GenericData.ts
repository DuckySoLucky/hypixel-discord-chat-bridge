abstract class GenericData<JSONData, Manager> {
  constructor(readonly manager: Manager) {}

  abstract toJSON(): JSONData;
}

export default GenericData;
