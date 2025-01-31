// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs').promises;
const INITIAL_VALUE = 0


/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  sortStudentByName = [];
  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  
  addStudent(newStudent) {
    const newNode = new Node(newStudent);
  
    // If empty, make head
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    
    this.length++; 
  
  } 

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {

    if(!this.head) return;

    let current = this.head;
    let previous = null;

    if(current.data.getEmail() === email) {
      this.head = current.next;
      if(!this.head) this.tail = null;
      this.length--;
      return
    }

    while(current && current.data.getEmail() !== email) {
      previous = current;
      current = current.next;
    }

    if(!current) return;

    previous.next = current.next;

    if(this.tail === current) {
      this.tail = previous;
    }

    this.length--;
    
}

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    if(!this.head) return -1;

    let current = this.head;

    while(current) {
      if(current.data.getEmail() === email) {
        return current.data;
      }
      current = current.next;
    }
    return -1
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  #clearStudents() {
    this.head   = null;
    this.tail   = null;
    this.length = INITIAL_VALUE;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
  
    if(!this.head) return;

    let current = this.head;
    let students = [];

    while(current) {
      students.push(current.data.getName());
      current = current.next;
    }

    const result = students.join(", ")

    return result;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    return this.sortStudentByName.sort((a,b) =>{
      if(a.getName() < b.getName()) return -1;
      if(a.getName() > b.getName()) return 1;
      return 0;
    }); 
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
   
    if(!this.head) return [];

    let current = this.head;
    const filteredStudents = [];

    while(current) {
      if(current.data.getSpecialization() === specialization) {
        filteredStudents.push(current.data);
      }
      current = current.next;
    }
     this.sortStudentByName = filteredStudents;


    return this.#sortStudentsByName();
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    return this.#sortStudentsByName().filter(student => student.year >= minAge);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    
    if(!fileName) throw new Error("Invalid file name");

    let current = this.head;
    const studentsArray = [];

    while(current) {
      studentsArray.push({
        name: current.data.getName(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization(),
        year: current.data.getYear()
      });
      current = current.next;
    }

    const jsonData = JSON.stringify(studentsArray, null, 2);
    await fs.writeFile(fileName, jsonData, 'utf8');
   

  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
  
    if(!fileName) throw new Error("Invalid file name");

    const data = await fs.readFile(fileName, 'utf-8');
    
    const students = JSON.parse(data);
    
    this.#clearStudents();

    students.forEach(student => {
      this.addStudent(new Student(student.name, student.email, student.specialization, student.year));

  });
}


}

module.exports = { LinkedList }
