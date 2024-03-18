import Express, { Request, Response } from "express";
const app = Express();

app.use(Express.json());

type Empleado = {
  id: number;
  cedula: string;
  fullname: string;
  pricePerHour: number;
};

type WorkedHours = {
  employeeId: string;
  hours: number;
};

let employees: Empleado[] = [
  {
    id: 1,
    cedula: "123",
    fullname: "Sebastian",
    pricePerHour: 35,
  },
];

let workedHours: WorkedHours[] = [
  {
    employeeId: "1",
    hours: 9,
  },
];

// (get) /employee
// -> obtener todos los empleados registrados
app.get("/employee", (req: Request, res: Response) => {
  return res.json(employees);
});

// (get) /employee/:id
// -> obtener un empleado enviando el id
app.get("/employee/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const empleado = employees.find((e) => e.id === parseInt(id));
  if (!empleado) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  return res.json(empleado);
});

// (get) /employee/:id/hours
// -> obtiene todas las horas trabajadas por un empleado, enviando el id
app.get("/employee/:id/hours", (req: Request, res: Response) => {
  const id = req.params.id;
  const horasTrabajadas = workedHours.filter((wh) => wh.employeeId === id);
  return res.json(horasTrabajadas);
});

// (get) /employee/:id/salary
// -> obtiene el salario a pagar basándose en el total de horas por el precio de hora del empleado
app.get("/employee/:id/salary", (req: Request, res: Response) => {
  const id = req.params.id;
  const empleado = employees.find((e) => e.id === parseInt(id));
  if (!empleado) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  const horasTrabajadas = workedHours
    .filter((wh) => wh.employeeId === id)
    .reduce((total, wh) => total + wh.hours, 0);
  const salario = horasTrabajadas * empleado.pricePerHour;
  return res.json({ salary: salario });
});

// (post) /employee
// -> agrega un empleado nuevo
app.post("/employee", (req: Request, res: Response) => {
  const nuevoEmpleado: Empleado = req.body;
  employees.push(nuevoEmpleado);
  return res.status(201).json(nuevoEmpleado);
});

// (post) /employee/:id/hours
// -> agrega un registro nuevo de horas usando el id del empleado para asociar las horas
app.post("/employee/:id/hours", (req: Request, res: Response) => {
  const id = req.params.id;
  const horasNuevas: WorkedHours = req.body;
  workedHours.push(horasNuevas);
  return res.status(201).json(horasNuevas);
});

// (put) /employee/:id
// -> actualiza la información del empleado (solo el fullname y pricePerhours)
app.put("/employee/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const empleado = employees.find((e) => e.id === parseInt(id));
  if (!empleado) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  const { fullname, pricePerHour } = req.body;
  empleado.fullname = fullname;
  empleado.pricePerHour = pricePerHour;
  return res.json(empleado);
});

// (delete) /employee
// -> borra un empleado y todo el registro de las horas trabajadas
app.delete("/employee/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const index = employees.findIndex((e) => e.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  employees.splice(index, 1);
  workedHours = workedHours.filter((wh) => wh.employeeId !== id);
  return res.status(204).send();
});

app.listen(3000, () => {
  return console.log("Escuchando en http://localhost:3000");
});
