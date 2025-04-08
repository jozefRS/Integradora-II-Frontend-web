"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/bootstrap/bootstrap.min.css";
import Sidebar from "../../kernel/components/Sidebar";
import "./AGestionVentas.css";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const AGestionVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;
  const [ventasFiltradas, setVentasFiltradas] = useState([]);

  useEffect(() => {
    // Muestra el loader mientras se cargan los datos
    Swal.fire({
      title: "Cargando datos...",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra el spinner
      },
    });

    fetchVentas();
    fetchClientes();
  }, []);

  const fetchVentas = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/ventas", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      console.log("Ventas obtenidas:", response.data); // Verifica los datos de ventas
      setVentas(response.data.body?.data || response.data || []);
      setVentasFiltradas(response.data.body?.data || response.data || []); // Inicializamos con todas las ventas
    } catch (error) {
      console.error("Error al obtener las ventas: ", error);
    }
  };

  const fetchClientes = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/cliente", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      console.log("Clientes obtenidos:", response.data); // Verifica los datos de clientes
      setClientes(response.data?.body?.data || []);
      Swal.close(); // Cierra el spinner cuando los datos se hayan cargado
    } catch (error) {
      console.error("Error al obtener los clientes: ", error);
      Swal.close(); // Cierra el spinner en caso de error
    }
  };

  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * ventasPorPagina,
    paginaActual * ventasPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(ventasFiltradas.length / ventasPorPagina)) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="gestion-ventas-container">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="content-container">
        <h1 className="text-center text-purple mb-3">Gestión de ventas</h1>
        <hr className="mb-4" />

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo de pago</th>
                <th>Tipo de entrega</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasPaginadas.map((venta) => {
                const cliente = clientes.find((c) => c.id === venta.idCliente);
                return (
                  <tr key={venta.id}>
                    <td>
                      {cliente
                        ? `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`
                        : "Sin datos"}
                    </td>
                    <td>{venta.tipoDePago}</td>
                    <td>{venta.tipoDeEntrega}</td>
                    <td>${venta.total}</td>
                    <td>
                      <button className="btn btn-sm btn-info">Detalles</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4 gap-3 align-items-center">
          <button
            className="btn btn-secondary"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual <= 1}
          >
            Anterior
          </button>

          <span>
            Página {paginaActual} de {Math.ceil(ventasFiltradas.length / ventasPorPagina)}
          </span>

          <button
            className="btn btn-secondary"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual >= Math.ceil(ventasFiltradas.length / ventasPorPagina)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default AGestionVentas;
