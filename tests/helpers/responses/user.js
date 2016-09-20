export const one = {
  "id": "1",
  "type": "user",
  "attributes": {
    "first-name": "Ricky",
    "last-name": "Bobby"
  },
  "relationships": {
    "job": {
      "data": {
        "id": "1",
        "name": "ceo"
      }
    }
  }
};
export const two = {
  "id": "2",
  "type": "user",
  "attributes": {
    "first-name": "Jane",
    "last-name": "Smith"
  },
  "relationships": {
    "job": {
      "data": {
        "id": "2",
        "name": "Engineer"
      }
    }
  }
};
export const three = {
  "id": "3",
  "type": "user",
  "attributes": {
    "first-name": "Milton",
    "last-name": "Waddams"
  },
  "relationships": {
    "job": {
      "data": {
        "id": "2",
        "name": "Engineer"
      }
    }
  }
};
export const arrayResponse = { data: [one, two, three] };
export const singleResponse = { data: one };
export default arrayResponse;
