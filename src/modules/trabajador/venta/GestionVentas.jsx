import { useState, useEffect } from "react";
import { Eye, Plus, Search } from "lucide-react";
import axios from "axios";
import "../../../assets/bootstrap/bootstrap.min.css";
import Sidebar from "../../../kernel/components/Sidebar";
import "./GestionVentas.css"; // Asegúrate de importar después de Bootstrap para sobrescribir estilos

const GestionVentas = () => {
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showDetalleVentaModal, setShowDetalleVentaModal] = useState(false);
    const [ventas, setVentas] = useState([]);
    const [catalogoProductos, setCatalogoProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tipoPago, setTipoPago] = useState("Efectivo");
    const [tipoEntrega, setTipoEntrega] = useState("Físico (en tienda)");
    const [tipoDeEntrega, setTipoDeEntrega] = useState("Físico (en tienda)");
    const [tipoDePago, setTipoDePago] = useState("Efectivo");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [busquedaProducto, setBusquedaProducto] = useState("");
    const [aplicarIVA, setAplicarIVA] = useState(false);
    const IVA_PORCENTAJE = 16;

    const [busquedaCliente, setBusquedaCliente] = useState(""); // Para buscar por nombre del cliente
    const [filtroPendiente, setFiltroPendiente] = useState(false); // Para filtrar los pedidos pendientes por enviar

    useEffect(() => {
        fetchVentas();
        fetchProductos();
        fetchClientes();
    }, []);

    const fetchVentas = async () => {
        const token = sessionStorage.getItem("token");
        const idUsuario = sessionStorage.getItem("idUsuario");

        try {
            const response = await axios.get(`http://localhost:8080/api/ventas/trabajador?id=${idUsuario}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            console.log("Ventas obtenidas:", response.data);  // Log para ver las ventas
            setVentas(response.data.body?.data || response.data || []);
        } catch (error) {
            console.error("Error al obtener las ventas del trabajador: ", error);
        }
    };

    const fetchProductos = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8080/api/producto", {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            setCatalogoProductos(response.data?.body?.data || []);
        } catch (error) {
            console.error("Error al obtener los productos: ", error);
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
            console.log("Clientes obtenidos:", response.data);  // Log para ver los clientes
            setClientes(response.data?.body?.data || []);
        } catch (error) {
            console.error("Error al obtener los clientes: ", error);
        }
    };

    const handleOpenRegistroModal = () => {
        setProductosSeleccionados([]);
        setAplicarIVA(false);
        setShowRegistroModal(true);
    };

    const handleCloseRegistroModal = () => {
        setShowRegistroModal(false);
    };

    const handleVerVenta = (venta) => {
        setShowDetalleVentaModal(true);
    };

    const handleCloseDetalleVentaModal = () => {
        setShowDetalleVentaModal(false);
    };

    const productosFiltrados = catalogoProductos.filter((producto) =>
        producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    );

    const agregarProducto = (producto) => {
        const productoExistente = productosSeleccionados.find((p) => p.id === producto.id);
        if (productoExistente) {
            const nuevosProductos = productosSeleccionados.map((p) => {
                if (p.id === producto.id) {
                    const nuevaCantidad = p.cantidad + 1;
                    return { ...p, cantidad: nuevaCantidad, total: nuevaCantidad * p.precio };
                }
                return p;
            });
            setProductosSeleccionados(nuevosProductos);
        } else {
            setProductosSeleccionados([
                ...productosSeleccionados,
                { ...producto, cantidad: 1, total: producto.precio },
            ]);
        }
    };

    const eliminarProducto = (productoId) => {
        setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== productoId));
    };

    const cambiarCantidadProducto = (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) nuevaCantidad = 1;
        const nuevosProductos = productosSeleccionados.map((p) => {
            if (p.id === productoId) {
                return { ...p, cantidad: nuevaCantidad, total: nuevaCantidad * p.precio };
            }
            return p;
        });
        setProductosSeleccionados(nuevosProductos);
    };

    const calcularSubtotal = () => {
        return productosSeleccionados.reduce((total, producto) => total + producto.total, 0);
    };

    const calcularIVA = () => {
        return aplicarIVA ? (calcularSubtotal() * IVA_PORCENTAJE) / 100 : 0;
    };

    const calcularTotal = () => {
        return calcularSubtotal() + calcularIVA();
    };

    const registrarVenta = async () => {
        const token = sessionStorage.getItem("token");
        const idTrabajador = sessionStorage.getItem("idUsuario");

        const ventaData = {
            idCliente: clienteSeleccionado,
            productos: productosSeleccionados.reduce((acc, producto) => {
                acc[producto.id] = producto.cantidad;
                return acc;
            }, {}),
            aplicarIVA,
            tipoDePago: tipoPago,
            tipoDeEntrega: tipoEntrega,
            idTrabajador,
            pagado: false, // Siempre inicia como pendiente
        };

        try {
            await axios.post("http://localhost:8080/api/ventas/realizar", ventaData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
            });

            alert("Venta registrada como pendiente.");
            fetchVentas();
            handleCloseRegistroModal();
        } catch (error) {
            console.error("Error al registrar la venta:", error.response?.data || error.message);
            alert(error.response?.data?.mensaje || "Error al registrar la venta.");
        }
    };

    // Filtrado de ventas por cliente y estado pendiente
    const ventasFiltradas = ventas.filter((venta) => {
        const clienteEncontrado = clientes.find(c => c.id === venta.idCliente || c.id === venta.cliente?.id);
        const nombreCliente = clienteEncontrado ? `${clienteEncontrado.nombre} ${clienteEncontrado.apellidoPaterno} ${clienteEncontrado.apellidoMaterno}` : "";

        const cumpleBusquedaCliente = nombreCliente.toLowerCase().includes(busquedaCliente.toLowerCase());
        const cumpleFiltroPendiente = !filtroPendiente || (!venta.enviado);  // Filtro por pendiente

        return cumpleBusquedaCliente && cumpleFiltroPendiente;
    });

    return (
        <div className="gestion-ventas-container">
            <Sidebar userName="Usuario" userEmail="usuario@example.com" />
            <div className="content-container">
                <h1 className="text-center text-purple mb-3">Gestión de ventas</h1>
                <hr className="mb-4" />

                {/* Búsqueda por cliente y filtro por pendiente */}
                <div className="d-flex mb-4">
                    <div className="me-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar cliente..."
                            value={busquedaCliente}
                            onChange={(e) => setBusquedaCliente(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="form-check-label me-2" htmlFor="filtroPendiente">
                            Filtrar pendientes por enviar
                        </label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="filtroPendiente"
                            checked={filtroPendiente}
                            onChange={() => setFiltroPendiente(!filtroPendiente)}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end mb-4">
                    <button className="btn btn-purple" onClick={handleOpenRegistroModal}>
                        Registrar
                    </button>
                </div>

                <table className="table table-hover shadow-sm">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Tipo de pago</th>
                            <th>Tipo de entrega</th>
                            <th>Total</th>
                            <th>Pagado</th>
                            <th>Enviado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasFiltradas.map((venta) => {
                            const clienteEncontrado = clientes.find(c => c.id === venta.idCliente || c.id === venta.cliente?.id);
                            return (
                                <tr key={venta.id}>
                                    <td>
                                        {clienteEncontrado
                                            ? `${clienteEncontrado.nombre} ${clienteEncontrado.apellidoPaterno} ${clienteEncontrado.apellidoMaterno}`
                                            : "Sin datos"}
                                    </td>
                                    <td>{venta.tipoDePago}</td>
                                    <td>{venta.tipoDeEntrega}</td>
                                    <td>${venta.total}</td>
                                    <td>{venta.pagado ? "Sí" : "No"}</td>
                                    <td>{venta.enviado ? "Sí" : "No"}</td>
                                    <td className="d-flex flex-column gap-1">
                                        {!venta.pagado && (
                                            <button className="btn btn-sm btn-warning" onClick={() => handleSubirEvidenciaPago(venta.id)}>
                                                Subir pago
                                            </button>
                                        )}
                                        {!venta.enviado && (
                                            <button className="btn btn-sm btn-info" onClick={() => handleSubirEvidenciaEnvio(venta.id)}>
                                                Subir envío
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal de Registro de Venta */}
            {showRegistroModal && (
                <>
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-body p-4">
                                    <h2 className="text-center text-purple mb-4">Registro de venta</h2>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-group mb-3">
                                                <label className="text-purple mb-2">Cliente</label>
                                                <select className="form-select" onChange={(e) => setClienteSeleccionado(e.target.value)}>
                                                    {clientes.map((cliente) => (
                                                        <option key={cliente.id} value={cliente.id}>
                                                            {cliente.nombre + " " + cliente.apellidoPaterno + " " + cliente.apellidoMaterno}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="text-purple mb-2">Tipo de pago</label>
                                            <select className="form-select" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
                                                <option value="efectivo">Efectivo</option>
                                                <option value="tarjeta">Tarjeta</option>
                                                <option value="transferencia">Transferencia</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="text-purple mb-2">Tipo de entrega</label>
                                            <select className="form-select" value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value)}>
                                                <option value="fisico">Físico (en tienda)</option>
                                                <option value="domicilio">Domicilio</option>
                                                <option value="paqueteria">Paquetería</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Aquí iría el código de búsqueda de productos y la selección de productos */}
                                    {/* ... */}
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-purple" onClick={registrarVenta}>
                                            Registrar
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleCloseRegistroModal}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop" style={{ opacity: 0.5 }} onClick={handleCloseRegistroModal}></div>
                </>
            )}
        </div>
    );
};

export default GestionVentas;
