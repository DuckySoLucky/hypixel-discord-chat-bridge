abstract class GenericData<JSONData> {
  abstract toJSON(): JSONData;
}

export default GenericData;
