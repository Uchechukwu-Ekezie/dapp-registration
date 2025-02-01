// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Register {
    address public admin;

    struct Student {
        uint256 id;
        string name;
    }

    mapping(uint256 => Student) public students;
    uint256[] public studentIds; 
    uint256 public studentCount;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }


    function registerStudent(string memory _name) public onlyAdmin {
        uint256 newId = studentCount + 1; 
        students[newId] = Student(newId, _name);
        studentIds.push(newId);
        studentCount++;
    }

  
    function removeStudent(uint256 _id) public onlyAdmin {
        require(students[_id].id != 0, "Student does not exist");

        // Find index of student in studentIds array
        uint256 index;
        bool found = false;
        for (uint256 i = 0; i < studentIds.length; i++) {
            if (studentIds[i] == _id) {
                index = i;
                found = true;
                break;
            }
        }
        require(found, "Student ID not found");

        // Remove student
        delete students[_id];

        // Shift last student into the empty slot
        uint256 lastIndex = studentIds.length - 1;
        if (index != lastIndex) {
            uint256 lastId = studentIds[lastIndex];
            studentIds[index] = lastId; // Move last student to removed index
            students[lastId].id = _id; // Update student ID in mapping
        }

        studentIds.pop(); // Remove last student from the list
        studentCount--;
    }

    // Get student details by ID
    function getStudentById(uint256 _id) public view returns (uint256, string memory) {
        require(students[_id].id != 0, "Student does not exist");
        Student memory student = students[_id];
        return (student.id, student.name);
    }

    // Get the total number of registered students
    function getTotalStudents() public view returns (uint256) {
        return studentCount;
    }

    // Get the list of all registered students
    function getAllStudents() public view returns (Student[] memory) {
        Student[] memory allStudents = new Student[](studentIds.length);
        for (uint256 i = 0; i < studentIds.length; i++) {
            allStudents[i] = students[studentIds[i]];
        }
        return allStudents;
    }
}
