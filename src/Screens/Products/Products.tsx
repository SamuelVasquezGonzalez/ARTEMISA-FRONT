import React, { useEffect, useState } from "react";
import {
    Grid,
    TextField,
    IconButton,
    InputAdornment,
    Fab,
    Modal,
    Box,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../../Components/Navbar/Navbar";

import { getData, sendFormData } from "../../Service/Api";
import { useDropzone } from "react-dropzone";
import ProductCard, { IProduct, IProductCategory } from "../../Components/ProductCard/ProductCard";

const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [sortByPrice, setSortByPrice] = useState<string>("");
    const [filterByCategory, setFilterByCategory] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [newProduct, setNewProduct] = useState<IProduct>({
        name: "",
        price: null,
        buyPrice: null,
        stock: null,
        category: "Salud",
    });
    const [image, setImage] = useState<File | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const token = localStorage.getItem("token") || undefined;

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const response = await getData({ token, path: "/v1/products" });
        if (response.ok && "data" in response) {
            setProducts(response.data as IProduct[]);
            setFilteredProducts(response.data as IProduct[]);
        }
    };

    const handlePriceSort = (event: SelectChangeEvent<string>) => {
        const order = event.target.value; // Aquí ya no es necesario hacer casting a string
    
        setSortByPrice(order);
    
        const sortedProducts = [...filteredProducts];
    
        // Ordenar los productos dependiendo de la opción seleccionada
        if (order === "asc") {
            sortedProducts.sort((a, b) => {
                const priceA = a.price ?? 0; // Usa 0 si price es null
                const priceB = b.price ?? 0; // Usa 0 si price es null
                return priceA - priceB;
            });
        } else if (order === "desc") {
            sortedProducts.sort((a, b) => {
                const priceA = a.price ?? 0; // Usa 0 si price es null
                const priceB = b.price ?? 0; // Usa 0 si price es null
                return priceB - priceA;
            });
        }
    
        setFilteredProducts(sortedProducts);
    };
    
    const handleCategoryFilter = (e: SelectChangeEvent<string>) => {
        const category = e.target.value as string;
        setFilterByCategory(category);

        if (category === "") {
            setFilteredProducts(products);
            const filtered = products.filter((product) =>
                product.category.includes(category)
            );
            setFilteredProducts(filtered);
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("productData", JSON.stringify(newProduct));
        if (image) {
            formData.append("image", image);
        }
        const response = await sendFormData({
            token,
            path: "/v1/product",
            body: formData,
            method: "POST",
        });

        if (response.ok) {
            getProducts();
            handleClose();
        }
    };

    const handleCategoryChange = (e: SelectChangeEvent<string>) => {
        setNewProduct({
            ...newProduct,
            category: e.target.value as IProductCategory,
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value,
        });
    };

    const onDrop = (acceptedFiles: File[]) => {
        setImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": []
        },
        maxFiles: 1,
    });

    // Filtrar productos por nombre
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <>
            <Navbar />
            <Grid
                container
                paddingTop="80px"
                padding="80px 20px 0 20px"
                justifyContent="center"
            >
                <Grid
    container
    spacing={2}
    paddingTop="20px"
    paddingX="20px"
    justifyContent="center"
    alignItems="center"
    marginBottom={"20px"}
>
    {/* Campo de búsqueda */}
    <Grid item xs={12} md={6} lg={4}>
        <TextField
            fullWidth
            label="Buscar productos"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Escribe para buscar"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "&:hover fieldset": {
                        borderColor: "primary.main",
                    },
                },
            }}
        />
    </Grid>

    {/* Filtro de orden por precio */}
    <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth variant="outlined">
            <InputLabel>Ordenar por precio</InputLabel>
            <Select
                value={sortByPrice}
                onChange={handlePriceSort}
                label="Ordenar por precio"
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: 2,
                }}
            >
                <MenuItem value="asc">Menor a Mayor</MenuItem>
                <MenuItem value="desc">Mayor a Menor</MenuItem>
            </Select>
        </FormControl>
    </Grid>

    {/* Filtro de categoría */}
    <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth variant="outlined">
            <InputLabel>Categoría</InputLabel>
            <Select
                value={filterByCategory}
                onChange={handleCategoryFilter}
                label="Categoría"
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: 2,
                }}
            >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Salud">Salud</MenuItem>
                <MenuItem value="Belleza">Belleza</MenuItem>
                <MenuItem value="Perfumes">Perfumes</MenuItem>
                <MenuItem value="Accesorios">Accesorios</MenuItem>
                <MenuItem value="Tenis">Tenis</MenuItem>
                <MenuItem value="Camisas/Camisetas">Camisas/Camisetas</MenuItem>
                <MenuItem value="Pantalones">Pantalones</MenuItem>
            </Select>
        </FormControl>
    </Grid>
</Grid>


                
                
                <Grid container spacing={4} justifyContent="center" marginBottom={"100px"}>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            _id={product._id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            stock={product.stock}
                            key={product._id}
                            picture={product.picture}
                            reload={getProducts}
                            buyPrice={product.buyPrice}
                            isStat={false}
                        />
                    ))}
                </Grid>
            </Grid>
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                onClick={handleOpen}
            >
                <AddIcon />
            </Fab>

            {/* Modal para crear un nuevo producto */}
            <Modal open={open} onClose={handleClose}>
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
                    <Typography
                        variant="h6"
                        gutterBottom
                        textAlign={"center"}
                        fontWeight={"bold"}
                    >
                        Añadir nuevo producto
                    </Typography>

                    <Grid container spacing={1}>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Nombre del producto"
                                name="name"
                                value={newProduct.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Precio de compra"
                                name="price"
                                type="number"
                                value={newProduct.price}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Precio de venta"
                                name="buyPrice"
                                type="number"
                                value={newProduct.buyPrice}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Stock"
                                name="stock"
                                type="number"
                                value={newProduct.stock}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    value={newProduct.category}
                                    label="Categoría"
                                    onChange={handleCategoryChange}
                                >
                                    <MenuItem value="Salud">Salud</MenuItem>
                                    <MenuItem value="Belleza">Belleza</MenuItem>
                                    <MenuItem value="Perfumes">
                                        Perfumes
                                    </MenuItem>
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
                        </Grid>
                    </Grid>

                    {/* Sección para subir imagen */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: "2px dashed grey",
                            borderRadius: "10px",
                            padding: "20px",
                            textAlign: "center",
                            marginTop: "20px",
                        }}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                            <Typography variant="body1">
                                Imagen seleccionada: {image.name}
                            </Typography>
                        ) : (
                            <Typography variant="body1">
                                Arrastra una imagen aquí o haz clic para
                                seleccionar
                            </Typography>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        onClick={handleSubmit}
                        sx={{ marginTop: 2 }}
                    >
                        Añadir producto
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Products;
