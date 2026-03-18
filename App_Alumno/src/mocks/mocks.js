export const mockStudents = [
  {
    name: "Z1368407G",
    dni: "Z1368407G",
    first_name: "MOHAMMED",
    last_name: "EL MALEHY",
    student_email_id: "MOHAMMEDELMALHY40@GMAIL.COM",
    student_mobile_number: "612525142",
    gender: "Hombre",
    date_of_birth: "1987-11-11",
    nationality: "Marruecos",
    city: "Almería",
    enabled: 1,
    image_url: "https://randomuser.me/api/portraits/men/32.jpg", // Foto de prueba
    enrollments: [
      {
        name: "C001",
        course_name: "Excel Avanzado para Finanzas",
        status: "En curso",
      },
    ],
  },
  {
    name: "X9876543J",
    dni: "X9876543J",
    first_name: "MARÍA",
    last_name: "GARCÍA LÓPEZ",
    student_email_id: "m.garcia@email.com",
    student_mobile_number: "600112233",
    gender: "Mujer",
    date_of_birth: "1992-05-20",
    nationality: "España",
    city: "Madrid",
    enabled: 1,
    image_url: "https://randomuser.me/api/portraits/women/44.jpg",
    enrollments: [],
  },
];

export const mockCourses = [
  {
    id: "C001",
    name: "Excel Avanzado para Finanzas",
    description:
      "Domina tablas dinámicas y macros aplicadas a la contabilidad.",
    duration: "40 horas",
    level: "Avanzado",
    image: "https://via.placeholder.com/300x200?text=Excel",
  },
  {
    id: "C002",
    name: "Marketing Digital y RRSS",
    description: "Estrategias de contenido y gestión de comunidades online.",
    duration: "60 horas",
    level: "Intermedio",
    image: "https://via.placeholder.com/300x200?text=Marketing",
  },
  {
    id: "C003",
    name: "Programación React Native",
    description: "Crea aplicaciones móviles nativas para iOS y Android.",
    duration: "120 horas",
    level: "Experto",
    image: "https://via.placeholder.com/300x200?text=React+Native",
  },
];
