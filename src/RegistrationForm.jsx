import { useForm } from "react-hook-form";

function RegistrationForm({ onSave, editingRecord, onCancelEdit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: editingRecord || {}
  });

  const onSubmit = (data) => {
    onSave(data);
    if (editingRecord) {
      onCancelEdit(); // Salimos del modo edición
    }
    reset(); // Limpiamos el formulario para el próximo ingreso
  };

  const handleCancel = () => {
    reset();
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register("nombreApellido", { required: "El nombre y apellido son requeridos" })} placeholder="Nombre y Apellido" className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
        {errors.nombreApellido && <p className="text-red-500 text-sm mt-1">{errors.nombreApellido.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input type="number" {...register("adultos", { required: "La cantidad de adultos es requerida", valueAsNumber: true, min: { value: 0, message: "El valor debe ser positivo" } })} placeholder="Adultos" className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
          {errors.adultos && <p className="text-red-500 text-sm mt-1">{errors.adultos.message}</p>}
        </div>
        <div>
          <input type="number" {...register("menores", { required: "La cantidad de menores es requerida", valueAsNumber: true, min: { value: 0, message: "El valor debe ser positivo" } })} placeholder="Menores" className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
          {errors.menores && <p className="text-red-500 text-sm mt-1">{errors.menores.message}</p>}
        </div>
      </div>
      <input {...register("direccion")} placeholder="Dirección" className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
      <input {...register("telefono")} placeholder="Teléfono" className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
      <div className="flex gap-4 pt-4">
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 font-semibold text-lg">
          {editingRecord ? "Actualizar Registro" : "Guardar Registro"}
        </button>
        {editingRecord && <button type="button" onClick={handleCancel} className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md font-semibold">Cancelar</button>}
      </div>
    </form>
  );
}

export default RegistrationForm;