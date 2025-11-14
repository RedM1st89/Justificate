"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";

export default function FaltasTicketForm() {
  const [ticketName, setTicketName] = useState("");
  const [faltas, setFaltas] = useState([
    { nombre: "", matricula: "", carrera: "", fecha: "", hora: "" },
  ]);

  const addFalta = () => {
    setFaltas([
      ...faltas,
      { nombre: "", matricula: "", carrera: "", fecha: "", hora: "" },
    ]);
  };

  const updateFalta = (i: number, field: string, value: string) => {
    const copy = [...faltas];
    // @ts-ignore
    copy[i][field] = value;
    setFaltas(copy);
  };

  const importExcel = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt: any) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      const mapped = rows.map((r) => ({
        nombre: r.Nombre || "",
        matricula: r.Matricula || "",
        carrera: r.Carrera || "",
        fecha: "",
        hora: "",
      }));

      setFaltas(mapped);
    };

    reader.readAsArrayBuffer(file);
  };

  const submitTicket = async () => {
    const payload = { ticketName, faltas };

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Ticket enviado correctamente!");
    } else {
      alert("Error al enviar ticket.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto grid gap-4">
      <Card className="p-4">
        <h1 className="text-2xl font-bold mb-4">Crear Ticket</h1>

        <Label>Nombre del Ticket</Label>
        <Input
          className="mb-4"
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
        />

        <div className="my-4">
          <Label>Importar Excel</Label>
          <Input type="file" accept=".xlsx,.xls" onChange={importExcel} />
        </div>
      </Card>

      {faltas.map((f, i) => (
        <Card key={i} className="p-4">
          <CardContent className="grid gap-3">
            <div>
              <Label>Nombre</Label>
              <Input
                value={f.nombre}
                onChange={(e) => updateFalta(i, "nombre", e.target.value)}
              />
            </div>

            <div>
              <Label>Matrícula</Label>
              <Input
                value={f.matricula}
                onChange={(e) => updateFalta(i, "matricula", e.target.value)}
              />
            </div>

            <div>
              <Label>Carrera</Label>
              <Input
                value={f.carrera}
                onChange={(e) => updateFalta(i, "carrera", e.target.value)}
              />
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={f.fecha}
                onChange={(e) => updateFalta(i, "fecha", e.target.value)}
              />
            </div>

            <div>
              <Label>Hora</Label>
              <Input
                type="time"
                value={f.hora}
                onChange={(e) => updateFalta(i, "hora", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addFalta} className="w-full">
        Agregar Falta
      </Button>
      <Button onClick={submitTicket} className="w-full">
        Enviar Ticket
      </Button>
    </div>
  );
}


