"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import ABI from "./Abi.json"

const contractABI = ABI



const contractAddress = "0x0976E205B6D0F3E6DDA97bE011ce2D4457cdAc39"

export default function RegisterContract() {
  const [contract, setContract] = useState(null)
  const [students, setStudents] = useState([])
  const [newStudentName, setNewStudentName] = useState("")
  const [removeStudentId, setRemoveStudentId] = useState("")
  const [searchStudentId, setSearchStudentId] = useState("")
  const [searchedStudent, setSearchedStudent] = useState(null)
  const [totalStudents, setTotalStudents] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" })
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const contract = new ethers.Contract(contractAddress, contractABI, signer)
          setContract(contract)
          await loadTotalStudents(contract)
        } catch (error) {
          console.error("Failed to initialize contract:", error)
          setError("Failed to connect to the contract. Please make sure MetaMask is installed and connected.")
        } finally {
          setIsLoading(false)
        }
      } else {
        setError("Please install MetaMask to use this application.")
        setIsLoading(false)
      }
    }

    initContract()
  }, [])

  const loadStudents = async () => {
    if (!contract) return
    setIsLoading(true)
    try {
      const allStudents = await contract.getAllStudents()
      setStudents(
        allStudents.map((student) => ({
          id: Number(student.id),
          name: student.name,
        })),
      )
    } catch (error) {
      console.error("Failed to load students:", error)
      setError("Failed to load students. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTotalStudents = async (contract) => {
    try {
      const total = await contract.getTotalStudents()
      setTotalStudents(Number(total))
    } catch (error) {
      console.error("Failed to load total students:", error)
    }
  }

  const registerStudent = async () => {
    if (!contract || !newStudentName) return
    setIsLoading(true)
    try {
      const tx = await contract.registerStudent(newStudentName)
      await tx.wait()
      setNewStudentName("")
      await loadTotalStudents(contract)
      await loadStudents()
    } catch (error) {
      console.error("Failed to register student:", error)
      setError("Failed to register student. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const removeStudent = async () => {
    if (!contract || !removeStudentId) return
    setIsLoading(true)
    try {
      const tx = await contract.removeStudent(Number(removeStudentId))
      await tx.wait()
      setRemoveStudentId("")
      await loadTotalStudents(contract)
      await loadStudents()
    } catch (error) {
      console.error("Failed to remove student:", error)
      setError("Failed to remove student. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const searchStudent = async () => {
    if (!contract || !searchStudentId) return
    setIsLoading(true)
    try {
      const [id, name] = await contract.getStudentById(Number(searchStudentId))
      setSearchedStudent({ id: Number(id), name })
    } catch (error) {
      console.error("Failed to find student:", error)
      setError("Failed to find student. Please try again.")
      setSearchedStudent(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="container max-w-2xl p-4 mx-auto">
      <div className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Student Register</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter student name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            className="w-full px-3 py-2 mb-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={registerStudent}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Register Student
          </button>
        </div>
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter student ID to remove"
            value={removeStudentId}
            onChange={(e) => setRemoveStudentId(e.target.value)}
            className="w-full px-3 py-2 mb-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={removeStudent}
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            Remove Student
          </button>
        </div>
        <div className="mb-6">
          <input
            type="number"
            placeholder="Enter student ID to search"
            value={searchStudentId}
            onChange={(e) => setSearchStudentId(e.target.value)}
            className="w-full px-3 py-2 mb-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={searchStudent}
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          >
            Search Student
          </button>
          {searchedStudent && (
            <div className="p-2 mt-2 bg-gray-100 rounded">
              <p>
                <strong>ID:</strong> {searchedStudent.id}
              </p>
              <p>
                <strong>Name:</strong> {searchedStudent.name}
              </p>
            </div>
          )}
        </div>
        <div className="mb-6">
          <button
            onClick={loadStudents}
            className="w-full px-4 py-2 font-bold text-white bg-purple-500 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline"
          >
            Get All Students
          </button>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Registered Students</h2>
          <p className="mb-2">Total Students: {totalStudents}</p>
          {students.length > 0 ? (
            <ul className="overflow-hidden bg-gray-100 rounded-lg">
              {students.map((student) => (
                <li key={student.id} className="px-4 py-2 border-b border-gray-200 last:border-b-0">
                  <span className="font-medium">ID: {student.id}</span> - {student.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students loaded. Click <span className="text-amber-500">Get All Students</span> to view the list.</p>
          )}
        </div>
      </div>
    </div>
  )
}

