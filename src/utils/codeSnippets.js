export const CODE_SNIPPETS = {
  typescript: `// TypeScript Demo
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const john: Person = { name: "John", age: 30 };
console.log(greet(john));

// Advanced TypeScript features
type Status = "pending" | "approved" | "rejected";

interface Task {
  id: number;
  title: string;
  status: Status;
  completedAt?: Date;
}

class TaskManager {
  private tasks: Task[] = [];

  addTask(title: string): void {
    const newTask: Task = {
      id: this.tasks.length + 1,
      title,
      status: "pending"
    };
    this.tasks.push(newTask);
  }

  updateTaskStatus(id: number, newStatus: Status): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.status = newStatus;
      if (newStatus === "approved") {
        task.completedAt = new Date();
      }
    }
  }

  getTaskSummary(): string {
    const pending = this.tasks.filter(t => t.status === "pending").length;
    const approved = this.tasks.filter(t => t.status === "approved").length;
    const rejected = this.tasks.filter(t => t.status === "rejected").length;

    return \`Tasks: \${pending} pending, \${approved} approved, \${rejected} rejected\`;
  }
}

// Usage
const manager = new TaskManager();
manager.addTask("Learn TypeScript");
manager.addTask("Build a project");
manager.updateTaskStatus(1, "approved");
console.log(manager.getTaskSummary());
`,

  javascript: `// JavaScript Demo
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

  python: `# Python Demo
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print([x for x in range(20) if is_prime(x)])`,

  html: `<!-- HTML Demo -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML page.</p>
</body>
</html>`,

  css: `/* CSS Demo */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  background: #333;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
}`,

  json: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "married": false,
  "education": {
    "degree": "Bachelor's",
    "major": "Computer Science"
  }
}`
}
