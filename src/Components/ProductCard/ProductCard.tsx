import React, { useState } from "react";
import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
    IconButton,
    Box,
    CardMedia,
    Button,
    Stack,
    TextField,
    Modal,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Chip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import toast, { Toaster } from "react-hot-toast";
import { Picture } from "../../main";
import { useProducts } from "../../ProductContext";
import { deleteData, sendFormData } from "../../Service/Api";

export type IProductCategory =
    | "Belleza"
    | "Salud"
    | "Perfumes"
    | "Accesorios"
    | "Tenis"
    | "Camisas/Camisetas"
    | "Pantalones";

export interface IProduct {
    _id?: string;
    name: string;
    category: IProductCategory;
    price: number | null;
    buyPrice: number | null;
    stock: number | null;
    picture?: Picture;
    created?: Date;
    reload?: () => void;
    isStat?: boolean;
    code?: number
}

export interface IProductSale extends IProduct {
    quantity: number;
}

const ProductCard: React.FC<IProduct> = ({
    _id,
    name,
    category,
    price,
    stock,
    picture,
    reload,
    buyPrice,
    isStat,
    code
}) => {
    const { productsState, addProduct } = useProducts();
    const [productQuantity, setProductQuantity] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [editProduct, setEditProduct] = useState<IProduct>({
        _id,
        name,
        category,
        price: price || null,
        stock: stock || null,
        buyPrice: buyPrice || null,
    });
    const [image, setImage] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const token = localStorage.getItem("token") || undefined;

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormErrors({});
    };

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleEditChange = (
        field: keyof IProduct,
        value: string | number
    ) => {
        setEditProduct({ ...editProduct, [field]: value });
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!editProduct.name) errors.name = "El nombre es requerido.";
        if (editProduct?.price && editProduct?.price < 1)
            errors.price = "El precio debe ser mayor que 0.";
        if (editProduct?.stock && editProduct?.stock < 0)
            errors.stock = "El stock no puede ser negativo.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const error = (message: string) => toast.error(message);
    const success = (message: string) => toast.success(message);

    const addToCart = () => {
        const productToAdd: IProductSale = {
            stock,
            picture,
            name,
            buyPrice,
            quantity: productQuantity,
            price,
            category,
            _id,
        };
        addProduct(productToAdd);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();

        formData.append("productData", JSON.stringify(editProduct));
        if (image) {
            formData.append("image", image);
        }
        const response = await sendFormData({
            token,
            path: `/v1/product/${_id}`,
            body: formData,
            method: "PUT",
        });

        if (response.ok) {
            handleCloseModal();
            success("actualizado correctamente");
            if (reload) reload();
        } else {
            error("No se pudo actualizar el producto");
        }
    };

    const deleteProduct = async () => {
        const response = await deleteData({
            token,
            path: `/v1/product/${_id}`,
        });

        if (response.ok) {
            success("Producto eliminado correctamente");
            handleCloseDeleteModal();
            if (reload) reload();
        } else {
            error("No se pudo eliminar el producto");
        }
    };

    const isLowStock = stock && stock < 5;
    const findProduct = productsState.products.find(
        (product) => product._id === _id
    );

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setImage(file);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
    });


    return (
        <>
            <Grid item xs={5} sm={5} md={4} lg={3} key={_id}>
                <Card
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: "#f9f9f9",
                        transition: "transform 0.25s, box-shadow 0.25s",
                        "&:hover": {
                            transform: "scale(1.03)",
                            boxShadow: 6,
                        },
                        position: "relative",
                        minHeight: "462px !important"
                    }}
                >
                    <CardActionArea
                    >
                        <CardMedia
                            component="img"
                            height="180"
                            image={
                                image
                                    ? URL.createObjectURL(image)
                                    : picture?.url || "/placeholder-image.png"
                            }
                            alt={name}
                            sx={{
                                objectFit: "cover",
                                backgroundColor: "#e0e0e0",
                                borderRadius: "8px 8px 0 0",
                            }}
                        />
                        <CardContent sx={{ padding: "12px" }}>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    color: "#333",
                                    textAlign: "center",
                                    fontSize: { xs: "1rem", sm: "1rem" },
                                }}
                            >
                                {name}
                            </Typography>
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    marginBottom: "4px",
                                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                    color: "#666",
                                }}
                            >
                                {category}
                            </Typography>
                            {buyPrice ? (
                                <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: { xs: "1rem", sm: "1rem" },
                                }}
                            >
                                Compra: ${buyPrice?.toLocaleString()}
                            </Typography>
                            ): null}
                            <Typography
                                variant="body1"
                                color="primary"
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: { xs: "1rem", sm: "1rem" },
                                }}
                            >
                                Venta: ${price?.toLocaleString()}
                            </Typography>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 45,
                                    right: 8,
                                    zIndex: 10,
                                    display: "flex",
                                    gap: 0.5,
                                }}
                            >
                                <IconButton
                                    onClick={handleOpenModal}
                                    aria-label="edit"
                                    color="primary"
                                    sx={{
                                        fontSize: { xs: "1rem", sm: "1rem" },
                                    }}
                                >
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    color="secondary"
                                    onClick={handleOpenDeleteModal}
                                    sx={{
                                        fontSize: { xs: "1rem", sm: "1rem" },
                                    }}
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </Box>
                            {stock && stock > 0 ? (
                                <Chip
                                    label={`Stock: ${stock} ${
                                        isLowStock ? "(Bajo)" : "disponibles"
                                    }`}
                                    color={isLowStock ? "error" : "success"}
                                    sx={{
                                        position: "absolute",
                                        left: 8,
                                        top: 8,
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                        },
                                        fontWeight: "bold",
                                    }}
                                />
                            ) : (
                                <Chip
                                    label="Agotado"
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        left: 8,
                                        top: 8,
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                        },
                                        fontWeight: "bold",
                                    }}
                                />
                            )}

<Chip
                                    label={`#${code}`}
                                    sx={{
                                        position: "absolute",
                                        left: 8,
                                        top: 45,
                                        fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.8rem",
                                        },
                                        fontWeight: "bold",
                                    }}
                                />

                            {stock && stock > 0 && !isStat ? (
                                <Stack
                                    direction={{ xs: "column", sm: "row" }} // Cambiar a columna en pantallas pequeñas
                                    spacing={2} // Aumentar el espaciado
                                    justifyContent="center"
                                    flexWrap="wrap"
                                    alignItems="center"
                                    sx={{ marginTop: "12px" }}
                                >
                                    <IconButton
                                        disabled={
                                            stock === 0 ||
                                            findProduct?._id === _id
                                        }
                                        onClick={() => {
                                            if (productQuantity > 1) {
                                                setProductQuantity(
                                                    productQuantity - 1
                                                );
                                            }
                                        }}
                                        aria-label="reducir stock"
                                        color="secondary"
                                        sx={{
                                            fontSize: {
                                                xs: "0.8rem",
                                                sm: "1rem",
                                            },
                                        }}
                                    >
                                        <RemoveIcon fontSize="inherit" />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={addToCart}
                                        disabled={
                                            stock === 0 ||
                                            findProduct?._id === _id
                                        }
                                        sx={{
                                            fontSize: {
                                                xs: "0.8rem",
                                                sm: ".8rem",
                                            },
                                        }}
                                    >
                                        Añadir{" "}
                                        {productQuantity > 0 &&
                                            `(${productQuantity})`}
                                    </Button>
                                    <IconButton
                                        disabled={
                                            stock === 0 ||
                                            findProduct?._id === _id
                                        }
                                        onClick={() => {
                                            if (
                                                stock &&
                                                productQuantity < stock
                                            ) {
                                                setProductQuantity(
                                                    productQuantity + 1
                                                );
                                            }
                                        }}
                                        aria-label="aumentar stock"
                                        color="primary"
                                        sx={{
                                            fontSize: {
                                                xs: "0.8rem",
                                                sm: "1rem",
                                            },
                                        }}
                                    >
                                        <AddIcon fontSize="inherit" />
                                    </IconButton>
                                </Stack>
                            ) : null}
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            {/* Modal para editar producto */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: 500,
                        width: "100%",
                        height: "auto",
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 3,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Editar Producto
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            value={editProduct.name}
                            onChange={(e) =>
                                handleEditChange("name", e.target.value)
                            }
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Compra(En cuanto lo compraste)"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={editProduct.buyPrice || null}
                            onChange={(e) =>
                                handleEditChange(
                                    "buyPrice",
                                    Number(e.target.value)
                                )
                            }
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Venta(En cuanto lo venderas)"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={editProduct.price || null}
                            onChange={(e) =>
                                handleEditChange(
                                    "price",
                                    Number(e.target.value)
                                )
                            }
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Stock"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={editProduct.stock || null}
                            onChange={(e) =>
                                handleEditChange(
                                    "stock",
                                    Number(e.target.value)
                                )
                            }
                            error={!!formErrors.stock}
                            helperText={formErrors.stock}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={editProduct.category}
                                onChange={(e) =>
                                    handleEditChange("category", e.target.value)
                                }
                            >
                                <MenuItem value="Belleza">Belleza</MenuItem>
                                <MenuItem value="Salud">Salud</MenuItem>
                                <MenuItem value="Perfumes">Perfumes</MenuItem>
                                <MenuItem value="Accesorios">
                                    Accesorios
                                </MenuItem>
                                <MenuItem value="Tenis">Tenis</MenuItem>
                                <MenuItem value="Camisas/Camisetas">
                                    Camisas/Camisetas
                                </MenuItem>
                                <MenuItem value="Pantalones">
                                    Pantalones
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Box
                            {...getRootProps()}
                            sx={{ border: "2px dashed gray", p: 2, mb: 2 }}
                        >
                            <input {...getInputProps()} />
                            <p>
                                {image
                                    ? image.name
                                    : "Arrastra y suelta una imagen aquí, o haz clic para seleccionar una imagen"}
                            </p>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Actualizar
                        </Button>
                    </form>
                </Box>
            </Modal>

            {/* Modal de confirmación de eliminación */}
            <Modal open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 300,
                        height: 200,
                        backgroundColor: "white",
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 3,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        ¿Estás seguro de eliminar este producto?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={deleteProduct}
                        >
                            Eliminar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleCloseDeleteModal}
                        >
                            Cancelar
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Toaster />
        </>
    );
};

export default ProductCard;
