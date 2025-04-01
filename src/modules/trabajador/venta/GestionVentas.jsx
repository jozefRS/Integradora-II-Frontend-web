import { useState, useEffect } from "react";
import { Eye, Plus, Search } from "lucide-react";
import axios from "axios";
import "../../../assets/bootstrap/bootstrap.min.css";
import Sidebar from "../../../kernel/components/Sidebar";
import "./GestionVentas.css";

const GestionVentas = () => {
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [showDetalleVentaModal, setShowDetalleVentaModal] = useState(false);
    const [ventas, setVentas] = useState([]);
    const [catalogoProductos, setCatalogoProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tipoPago, setTipoPago] = useState("");
const [tipoEntrega, setTipoEntrega] = useState("");
    const [tipoDeEntrega, setTipoDeEntrega] = useState("");
    const [tipoDePago, setTipoDePago] = useState("");


    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [busquedaProducto, setBusquedaProducto] = useState("");
    const [aplicarIVA, setAplicarIVA] = useState(false);
    const IVA_PORCENTAJE = 16;

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
    
            // Aquí puede variar según cómo responda tu backend
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
    clienteId: clientes[0].id,
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
  {ventas.map((venta) => {
    const clienteEncontrado = clientes.find(c => c.id === venta.clienteId || c.id === venta.cliente?.id);

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
                                                <select className="form-select">
                                                    {clientes.map((cliente) => (
                                                        <option key={cliente.id} value={cliente.id}>
                                                            {cliente.nombre +" " + cliente.apellidoPaterno + " " + cliente.apellidoMaterno}
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
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control mx-2"
                                                                            value={producto.cantidad}
                                                                            style={{ width: "60px", textAlign: "center" }}
                                                                            onChange={(e) => cambiarCantidadProducto(producto.id, parseInt(e.target.value) || 1)}
                                                                            min="1"
                                                                        />
                                                                        <button
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => cambiarCantidadProducto(producto.id, producto.cantidad + 1)}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">${producto.total}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center py-3">
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
