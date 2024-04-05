import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public students: Student[] = []

  async create(student: Student) {
    this.students.push(student)
  }

  async findByEmail(email: string) {
    const studentByEmail = this.students.find(
      (student) => student.email === email,
    )

    if (!studentByEmail) {
      return null
    }

    return studentByEmail
  }
}
