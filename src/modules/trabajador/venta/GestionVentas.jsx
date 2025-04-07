import { useState, useEffect } from "react";
import { Eye, Plus, Search } from "lucide-react";
import axios from "axios";
import "../../../assets/bootstrap/bootstrap.min.css";
import Sidebar from "../../../kernel/components/Sidebar";
import "./GestionVentas.css"; // Asegúrate de importar después de Bootstrap para sobrescribir estilos
import imageCompression from "browser-image-compression";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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
    const [imagenEnvio, setImagenEnvio] = useState(null);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [mostrarModalEnvio, setMostrarModalEnvio] = useState(false);
    const [archivoEnvio, setArchivoEnvio] = useState(null);
    const [busquedaProducto, setBusquedaProducto] = useState("");
    const [aplicarIVA, setAplicarIVA] = useState(false);
    const IVA_PORCENTAJE = 16;
    const [mostrarModalVisualizacion, setMostrarModalVisualizacion] = useState(false);


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

    const confirmarCambioPago = (idVenta) => {
        const confirmado = window.confirm("¿Confirmas que el pago ha sido recibido correctamente?");
        if (!confirmado) return;

        const token = sessionStorage.getItem("token");

        axios.patch(`http://localhost:8080/api/ventas/${idVenta}`, {}, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        })
            .then(() => {
                alert("Estado actualizado a pagado.");
                fetchVentas();
            })
            .catch((err) => {
                console.error("Error al cambiar estado de pago:", err);
                alert("No se pudo actualizar el estado de pago.");
            });
    };
    const handleGenerarPDF = async () => {
        const doc = new jsPDF();
        const cliente = clientes.find(c => c.id === ventaSeleccionada.idCliente);

        doc.setFontSize(18);
        doc.text("Comprobante de Venta", 14, 22);

        doc.setFontSize(12);
        doc.text(`Cliente: ${cliente?.nombre} ${cliente?.apellidoPaterno} ${cliente?.apellidoMaterno}`, 14, 32);
        doc.text(`Tipo de pago: ${ventaSeleccionada.tipoDePago}`, 14, 40);
        doc.text(`Tipo de entrega: ${ventaSeleccionada.tipoDeEntrega}`, 14, 48);
        doc.text(`Total: $${ventaSeleccionada.total}`, 14, 56);

        const productosPDF = Object.entries(ventaSeleccionada.productos || {}).map(([idProducto, cantidad]) => {
            const producto = catalogoProductos.find(p => p.id === idProducto);
            return [
                producto ? producto.nombre : "Desconocido",
                cantidad,
                producto ? `$${producto.precio.toFixed(2)}` : "-",
                producto ? `$${(producto.precio * cantidad).toFixed(2)}` : "-"
            ];
        });

        autoTable(doc, {
            startY: 66,
            head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
            body: productosPDF
        });

        // Si es entrega por domicilio o paquetería y hay imagen de envío, incluirla
        if (
            ["domicilio", "paqueteria"].includes(ventaSeleccionada.tipoDeEntrega.toLowerCase()) &&
            ventaSeleccionada.urlImagenEnvio
        ) {
            const imageUrl = `http://localhost:8080/images/${ventaSeleccionada.urlImagenEnvio}`;
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();

                reader.onloadend = () => {
                    const imgData = reader.result;
                    const finalY = doc.lastAutoTable.finalY + 10;

                    doc.text("Evidencia de envío:", 14, finalY);
                    doc.addImage(imgData, "JPEG", 14, finalY + 5, 80, 60); // Ajusta tamaño aquí

                    doc.save(`venta-${ventaSeleccionada.id}.pdf`);
                };

                reader.readAsDataURL(blob);
            } catch (error) {
                console.error("Error al cargar la imagen de evidencia:", error);
                alert("No se pudo cargar la imagen de envío para el PDF.");
            }
        } else {
            doc.save(`venta-${ventaSeleccionada.id}.pdf`);
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

    const handleVerVenta = async (venta) => {
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.get(`http://localhost:8080/api/ventas/${venta.id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            setVentaSeleccionada(res.data.body?.data || res.data);
            setShowDetalleVentaModal(true);
        } catch (err) {
            console.error("Error al obtener detalles de venta:", err);
            alert("No se pudieron cargar los detalles de la venta.");
        }
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
    const handleImageEnvioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagenEnvio(file);
        }
    };


    const eliminarProducto = (productoId) => {
        setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== productoId));
    };
    const subirImagenEnvio = async (ventaId) => {
        if (!archivoEnvio) return alert("Selecciona un archivo");

        const formData = new FormData();
        const imageName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
        formData.append("image", archivoEnvio, imageName);

        const token = sessionStorage.getItem("token");

        try {
            const response = await axios.post(`http://localhost:8080/api/upload`, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = response.data.imageUrl;

            // Ahora actualizas la venta con ese URL
            await axios.put(`http://localhost:8080/api/ventas/${ventaId}/enviar`, { evidencia: imageUrl }, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
            });

            alert("Imagen de envío cargada exitosamente");
            setMostrarModalEnvio(false);
            setArchivoEnvio(null);
            fetchVentas();
        } catch (error) {
            console.error("Error al subir la imagen o actualizar la venta:", error);
            alert("Ocurrió un error al subir la imagen de envío.");
        }
    };


    const handleSubirEvidenciaEnvio = async (venta) => {
        if (!["domicilio", "paqueteria"].includes(venta.tipoDeEntrega)) {
            alert("Solo se puede subir evidencia de envío para domicilio o paquetería.");
            return;
        }

        const imageUrl = await subirImagenEnvio();
        if (!imageUrl) return;

        const token = sessionStorage.getItem("token");

        try {
            await axios.put(`http://localhost:8080/api/ventas/${venta.id}/enviar`, {
                evidencia: imageUrl,
            }, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            alert("Evidencia de envío registrada.");
            fetchVentas();
        } catch (error) {
            console.error("Error al registrar evidencia de envío:", error);
            alert("Error al registrar la evidencia.");
        }
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

        // Asegúrate de que el cliente seleccionado tiene un ID
        console.log("Cliente seleccionado:", clientes[0]);  // Verifica que el cliente tiene un ID

        const ventaData = {
            idCliente: clienteSeleccionado,  // Usamos el cliente seleccionado
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

        console.log("Datos de venta:", ventaData);  // Verifica que el clienteId esté correcto

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



    return (
        <div className="gestion-ventas-container">
            <Sidebar userName="Usuario" userEmail="usuario@example.com" />
            <div className="content-container">
                <h1 className="text-center text-purple mb-3">Gestión de ventas</h1>
                <hr className="mb-4" />

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
                            <th>Pagado</th> {/* ✅ nuevo */}
                            <th>Enviado</th> {/* ✅ nuevo */}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta) => {
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
                                    <td>{venta.estado ? "Sí" : "No"}</td>
                                    <td>{venta.enviado ? "Sí" : "No"}</td>
                                    <td className="d-flex flex-column gap-1">
                                        {venta.estado && (
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => {
                                                    setVentaSeleccionada(venta);
                                                    setShowDetalleVentaModal(true);
                                                }}
                                            >
                                                Ver detalles
                                            </button>
                                        )}
                                        {!venta.estado && (
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => confirmarCambioPago(venta.id)}
                                            >
                                                Marcar como pagado
                                            </button>
                                        )}


                                        {(venta.tipoDeEntrega === 'domicilio' || venta.tipoDeEntrega === 'paqueteria') && !venta.urlImagenEnvio && (
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => {
                                                    setVentaSeleccionada(venta);
                                                    setMostrarModalEnvio(true);
                                                }}
                                            >
                                                Subir imagen de envío
                                            </button>
                                        )}

                                        {venta.urlImagenEnvio && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => {
                                                    setVentaSeleccionada(venta);
                                                    setMostrarModalVisualizacion(true);
                                                }}
                                            >
                                                Visualizar evidencia
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
            {mostrarModalEnvio && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4">
                            <h5 className="mb-3 text-center">Subir evidencia de envío</h5>
                            <input type="file" className="form-control mb-3" onChange={(e) => setArchivoEnvio(e.target.files[0])} />
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => subirImagenEnvio(ventaSeleccionada.id)}
                                >
                                    Subir
                                </button>
                                <button className="btn btn-secondary" onClick={() => setMostrarModalEnvio(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {mostrarModalVisualizacion && ventaSeleccionada && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4">
                            <h5 className="mb-3 text-center">Evidencia de Envío</h5>
                            <img
                                src={ventaSeleccionada.urlImagenEnvio
                                    ? `http://localhost:8080/images/${ventaSeleccionada.urlImagenEnvio}`
                                    : "/placeholder.svg"}
                                alt="Evidencia de envío"
                                className="img-fluid rounded"
                                style={{ maxHeight: '400px', objectFit: 'contain' }}
                            />

                            <div className="d-flex justify-content-end mt-3">
                                <button className="btn btn-secondary" onClick={() => setMostrarModalVisualizacion(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDetalleVentaModal && ventaSeleccionada && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content p-4">
                            <h5 className="text-center mb-4">Detalles de la Venta</h5>

                            <p><strong>Cliente:</strong> {
                                (() => {
                                    const cliente = clientes.find(c => c.id === ventaSeleccionada.idCliente);
                                    return cliente
                                        ? `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`
                                        : "No disponible";
                                })()
                            }</p>
                            <p><strong>Tipo de pago:</strong> {ventaSeleccionada.tipoDePago}</p>
                            <p><strong>Tipo de entrega:</strong> {ventaSeleccionada.tipoDeEntrega}</p>
                            <p><strong>Total:</strong> ${ventaSeleccionada.total}</p>

                            <h6 className="mt-4">Productos comprados:</h6>
                            <table className="table table-sm mt-2">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(ventaSeleccionada.productos || {}).map(([idProducto, cantidad], index) => {
                                        const producto = catalogoProductos.find(p => p.id === idProducto);
                                        return (
                                            <tr key={index}>
                                                <td>{producto ? producto.nombre : "Producto no encontrado"}</td>
                                                <td>{cantidad}</td>
                                                <td>${producto ? producto.precio.toFixed(2) : "-"}</td>
                                                <td>${producto ? (producto.precio * cantidad).toFixed(2) : "-"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>


                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button className="btn btn-success" onClick={handleGenerarPDF}>
                                    Descargar PDF
                                </button>
                                <button className="btn btn-secondary" onClick={() => setShowDetalleVentaModal(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}




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


                                    {/* Filtro de productos */}
                                    <div className="bg-light p-3 rounded mb-4">
                                        <h3 className="text-purple fs-5 mb-3">Buscar productos</h3>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text bg-purple text-white">
                                                <Search size={18} color="grey" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Buscar por nombre, categoría o precio..."
                                                value={busquedaProducto}
                                                onChange={(e) => setBusquedaProducto(e.target.value)}
                                            />
                                        </div>

                                        <div className="table-responsive mb-3">
                                            <table className="table table-hover">
                                                <thead className="bg-secondary bg-opacity-10 text-purple">
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Categoría</th>
                                                        <th className="text-center">Precio</th>
                                                        <th className="text-center">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productosFiltrados.length > 0 ? (
                                                        productosFiltrados.map((producto) => (
                                                            <tr key={producto.id}>
                                                                <td>
                                                                    <div className="fw-medium">{producto.nombre}</div>
                                                                    <div className="text-muted small">{producto.descripcion}</div>
                                                                </td>
                                                                <td>{producto.categoria}</td>
                                                                <td className="text-center">${producto.precio}</td>
                                                                <td className="text-center">
                                                                    <button
                                                                        className="btn btn-sm btn-purple"
                                                                        onClick={() => agregarProducto(producto)}
                                                                    >
                                                                        <Plus size={16} /> Agregar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center py-3">
                                                                No se encontraron productos
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Tabla de productos seleccionados */}
                                    <div className="bg-light p-3 rounded mb-4">
                                        <h3 className="text-purple fs-5 mb-3">Productos seleccionados</h3>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead className="bg-secondary bg-opacity-10 text-purple">
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th className="text-center">Precio</th>
                                                        <th className="text-center">Cantidad</th>
                                                        <th className="text-center">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productosSeleccionados.length > 0 ? (
                                                        productosSeleccionados.map((producto) => (
                                                            <tr key={producto.id}>
                                                                <td>
                                                                    <div className="fw-medium">{producto.nombre}</div>
                                                                    <div className="text-muted small">{producto.descripcion}</div>
                                                                </td>
                                                                <td className="text-center">${producto.precio}</td>
                                                                <td className="text-center">
                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => cambiarCantidadProducto(producto.id, producto.cantidad - 1)}
                                                                            disabled={producto.cantidad <= 1}  // Deshabilitar si cantidad es 1
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control mx-2"
                                                                            value={producto.cantidad}
                                                                            style={{ width: "60px", textAlign: "center" }}
                                                                            onChange={(e) => {
                                                                                const cantidad = parseInt(e.target.value) || 1;
                                                                                // Limitar la cantidad a la cantidad máxima disponible
                                                                                const stockMaximo = producto.stock;  // Asegúrate de que 'stock' sea un campo en tu producto
                                                                                if (cantidad <= stockMaximo) {
                                                                                    cambiarCantidadProducto(producto.id, cantidad);
                                                                                } else {
                                                                                    alert(`Cantidad máxima disponible: ${stockMaximo}`);
                                                                                }
                                                                            }}
                                                                            min="1"
                                                                            max={producto.stock}  // Limita la cantidad al stock disponible
                                                                        />
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => cambiarCantidadProducto(producto.id, producto.cantidad + 1)}
                                                                            disabled={producto.cantidad >= producto.stock}  // Deshabilitar si se llega al stock máximo
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">${producto.total}</td>
                                                                <td className="text-center">
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => eliminarProducto(producto.id)}
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center py-3">
                                                                No hay productos seleccionados
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </table>
                                        </div>

                                        {/* Switch IVA */}
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-end align-items-center mb-3">
                                                <div className="me-3 text-purple fw-medium">
                                                    ¿Desea aplicar IVA ({IVA_PORCENTAJE}%)?
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="aplicarIVA"
                                                        checked={aplicarIVA}
                                                        onChange={() => setAplicarIVA(!aplicarIVA)}
                                                        style={{
                                                            width: "3em",
                                                            height: "1.5em",
                                                            backgroundColor: aplicarIVA ? "#9c2a86" : "",
                                                            borderColor: "#9c2a86",
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex flex-column align-items-end mt-3">
                                                <div className="d-flex justify-content-between mb-2" style={{ width: "300px" }}>
                                                    <span className="text-muted">Subtotal:</span>
                                                    <span className="fw-medium">${calcularSubtotal().toFixed(2)}</span>
                                                </div>

                                                {aplicarIVA && (
                                                    <div className="d-flex justify-content-between mb-2" style={{ width: "300px" }}>
                                                        <span className="text-muted">IVA ({IVA_PORCENTAJE}%):</span>
                                                        <span className="fw-medium">${calcularIVA().toFixed(2)}</span>
                                                    </div>
                                                )}

                                                <div className="d-flex justify-content-between" style={{ width: "300px" }}>
                                                    <span className="fw-bold">Total:</span>
                                                    <span className="fs-3 fw-bold text-purple">${calcularTotal().toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

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