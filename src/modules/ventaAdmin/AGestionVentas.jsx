import { useState, useEffect } from "react";
import { Eye, Plus, Search } from "lucide-react";
import axios from "axios";
import "../../assets/bootstrap/bootstrap.min.css";
import Sidebar from "../../kernel/components/Sidebar";
import "./AGestionVentas.css";

const AGestionVentas = () => {
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showDetalleVentaModal, setShowDetalleVentaModal] = useState(false);
    const [ventas, setVentas] = useState([]);
    const [catalogoProductos, setCatalogoProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tipoPago, setTipoPago] = useState("");
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [tipoDeEntrega, setTipoDeEntrega] = useState("");
    const [tipoDePago, setTipoDePago] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);


    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [busquedaProducto, setBusquedaProducto] = useState("");
    const [aplicarIVA, setAplicarIVA] = useState(false);
    const IVA_PORCENTAJE = 16;

    const [paginaActual, setPaginaActual] = useState(1);
    const [ventasPorPagina] = useState(10); // Puedes ajustar este valor
    const [busquedaCliente, setBusquedaCliente] = useState('');



    useEffect(() => {
        fetchVentas();
        fetchProductos();
        fetchClientes();
    }, []);

    const fetchVentas = async () => {
        const token = sessionStorage.getItem("token");
        const idUsuario = sessionStorage.getItem("idUsuario");

        try {
            const response = await axios.get(`http://localhost:8080/api/ventas`, {
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

    const ventasFiltradas = ventas.filter((venta) => {
        const cliente = clientes.find(c => c.id === venta.idCliente || c.id === venta.cliente?.id);
        if (!cliente) return false;

        const nombreCompleto = `
            ${cliente.nombre || ''} 
            ${cliente.apellidoPaterno || ''} 
            ${cliente.apellidoMaterno || ''}
        `.toLowerCase().trim();

        return nombreCompleto.includes(busquedaCliente.toLowerCase().trim());
    });

    const ventasPaginadas = ventasFiltradas.slice(
        (paginaActual - 1) * ventasPorPagina,
        paginaActual * ventasPorPagina
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




    return (
        <div className="gestion-ventas-container">
            <Sidebar userName="Usuario" userEmail="usuario@example.com" />
            <div className="content-container">
                <h1 className="text-center text-purple mb-3">Gestión de ventas</h1>
                <hr className="mb-4" />
                {/* 
                <div className="d-flex justify-content-end mb-4">
                    <button className="btn btn-purple" onClick={handleOpenRegistroModal}>
                        Registrar
                    </button>
                </div> */}

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre de cliente..."
                        value={busquedaCliente}
                        onChange={(e) => {
                            setBusquedaCliente(e.target.value);
                            setPaginaActual(1); // Reiniciar a la primera página en cada búsqueda
                        }}
                    />
                </div>


                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Tipo de pago</th>
                                <th>Tipo de entrega</th>
                                <th>Total</th>
                                <th>Pagado</th> {/* ✅ nuevo */}
                                <th>Enviado</th> {/* ✅ nuevo */}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasPaginadas.map((venta) => {
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
                    <div className="d-flex justify-content-center mt-4 gap-3">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </button>

                        <span>Página {paginaActual}</span>

                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);
                                setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
                            }}
                            disabled={paginaActual >= Math.ceil(ventasFiltradas.length / ventasPorPagina)}
                        >
                            Siguiente
                        </button>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default AGestionVentas;