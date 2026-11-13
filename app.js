
const SUPABASE_URL = "https://auupglepkqfsynfiavoe.supabase.co";
const SUPABASE_KEY = "sb_publishable_88bhZ9QlWDT6457HT6MYkg_lL2wkO76";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
console.log("URL utilizada:", SUPABASE_URL);
console.log("Storage URL:", supabaseClient.storageUrl);


const personas = [
  // ESTADÍSTICA
    { id: 1, area: "Estadística", nombre: "Jaquelin Stefania Bermeo Villacres" },
    { id: 2, area: "Estadística", nombre: "Daniel wilson Orrala Tigrero" },
    { id: 3, area: "Estadística", nombre: "Alisson Belen Salgado Perugachi" },
    { id: 4, area: "Estadística", nombre: "Darwin Jeferson Bernal Guasgua" },
    { id: 17, area: "Estadística", nombre: "Maria Jared Velastegui Freire" },

    // FARMACIA
    { id: 6, area: "Farmacia", nombre: "Britney Yadira Diaz Llerena" },

    // PREPARACIÓN
    { id: 30, area: "Preparación", nombre: "Amanda Sanches Janeth Johanna" },
    { id: 15, area: "Preparación", nombre: "Angie Adriana Taco García" },
    { id: 9, area: "Preparación", nombre: "Ingrit Priscila Tipanluisa Salazar" },
    { id: 10, area: "Preparación", nombre: "Evelin Fernanda Herrera Almeida" },
    { id: 11, area: "Preparación", nombre: "Kevin Andrés Obando Cárdenas" },

    // ODONTOLOGÍA
    { id: 12, area: "Odontología", nombre: "Danna Yamile Arteaga Furlan" },
    { id: 13, area: "Odontología", nombre: "Cinthia Shirley Sacón Cedeño" },
    { id: 14, area: "Odontología", nombre: "Melany Anahí González Imbaquingo" },

    // VACUNAS
    { id: 7, area: "Vacunas", nombre: "Estefany Dayana Pineda Chimaru" },
    { id: 5, area: "Vacunas", nombre: "Bran Ariel Farinango Zambrano" },
    { id: 16, area: "Vacunas", nombre: "Miriam Estefania Cevallos Barre" },
    { id: 22, area: "Vacunas", nombre: "Heidy Mariela Quinchiguango Quishpe" },
    { id: 23, area: "Vacunas", nombre: "Anahí Nicol Tutillo Paisano" },
    { id: 24, area: "Vacunas", nombre: "Tanya Lucia Cevallos Barre" },
    { id: 28, area: "Vacunas", nombre: "Evelin Jhoanna Caicedo Quishpe" },
    { id: 29, area: "Vacunas", nombre: "Katerine Milleidy Diaz santana" },

    // ARCHIVOS
    { id: 4, area: "Archivos", nombre: "Darwin Jeferson Bernal Guasgua" },
    { id: 26, area: "Archivos", nombre: "Juan Sebastian Majin Pillajo" },
    { id: 27, area: "Archivos", nombre: "Brithany Naomi Aguirre Irua" },
    { id: 31, area: "Archivos", nombre: "Saida Marianela Ferrín Muendez" },
    { id: 25, area: "Archivos", nombre: "Gloria Nayely Noquez Vasquez" },
    { id: 32, area: "Archivos", nombre: "Melany Andrea Santi Tapia" },

    // MATRICES
    { id: 18, area: "Matrices", nombre: "Stalyn Rodolfo Quinchiguango Yanez" },
    { id: 8, area: "Matrices", nombre: "Jhony Israel Chaves Concha" },

    // ENCUESTAS
    { id: 20, area: "Encuestas", nombre: "Estefanía Dayana Cuastumal Josa" },
    { id: 21, area: "Encuestas", nombre: "José Daniel Zambrano Servonet" },
    { id: 19, area: "Encuestas", nombre: "Mateo Alexander Escobar Caiza" },



];
const $ = id => document.getElementById(id);
const fechaLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
$("fecha").value = fechaLocal();
$("fecha").max = fechaLocal();
[...new Set(personas.map(p=>p.area))].sort().forEach(area=>{
  $("area").add(new Option(area,area));
});
$("area").addEventListener("change",()=>{
  const s=$("persona");s.replaceChildren(new Option("Selecciona tu nombre",""));
  personas.filter(p=>p.area===$("area").value).sort((a,b)=>a.nombre.localeCompare(b.nombre)).forEach(p=>s.add(new Option(p.nombre,String(p.id))));
  s.disabled=!$("area").value;
});
$("form").addEventListener("submit", async e=>{
  e.preventDefault();
  const personaSeleccionada = personas.find(
  p => p.id === Number($("persona").value)
);
if (!personaSeleccionada) {
  $("mensaje").textContent = "Selecciona tu nombre antes de continuar.";
  return;
}

  const files=[$("fotoEntrada").files[0],$("fotoSalida").files[0]];
  if(files.some(f=>!f || !["image/jpeg","image/png","image/webp"].includes(f.type) || f.size>5*1024*1024)){
    $("mensaje").textContent="Adjunta dos imágenes JPG, PNG o WebP de hasta 5 MB cada una.";return;
  }
  if($("fecha").value>fechaLocal() || $("salida").value<=$("entrada").value){
    $("mensaje").textContent="Revisa la fecha y los horarios. La salida debe ser posterior a la entrada.";return;
  }
  $("mensaje").textContent = "Guardando asistencia, espera un momento...";
  const fotoEntrada = files[0];

const extensionEntrada = fotoEntrada.name.split(".").pop().toLowerCase();
const rutaEntrada = `entradas/${crypto.randomUUID()}.${extensionEntrada}`;
const { data: datosEntrada, error: errorEntrada } = await supabaseClient.storage
  .from("fotos-asistensias")
  .upload(rutaEntrada, fotoEntrada, {
    contentType: fotoEntrada.type,
    upsert: false
  });

if (errorEntrada) {
  $("mensaje").textContent = "Error al subir la foto de entrada: " + errorEntrada.message;
  return;
}

const fotoSalida = files[1];

const extensionSalida = fotoSalida.name.split(".").pop().toLowerCase();
const rutaSalida = `salidas/${crypto.randomUUID()}.${extensionSalida}`;

const { data: datosSalida, error: errorSalida } = await supabaseClient.storage
  .from("fotos-asistensias")
  .upload(rutaSalida, fotoSalida, {
    contentType: fotoSalida.type,
    upsert: false
  });

if (errorSalida) {
  $("mensaje").textContent = "Error al subir la foto de salida: " + errorSalida.message;
  return;
}

const { error: errorRegistro } = await supabaseClient
  .from("asistensias")
  .insert({
    nombre: personaSeleccionada.nombre,
    area: personaSeleccionada.area,
    fecha: $("fecha").value,
    hora_entrada: $("entrada").value,
    hora_salida: $("salida").value,
    foto_entrada: rutaEntrada,
    foto_salida: rutaSalida
  });

if (errorRegistro) {
  $("mensaje").textContent = "Error al guardar la asistencia: " + errorRegistro.message;
  return;
}

$("mensaje").textContent = "¡Asistencia registrada correctamente!";

});

