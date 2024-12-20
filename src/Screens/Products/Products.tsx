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
import ProductCard, {
    IProduct,
    IProductCategory,
} from "../../Components/ProductCard/ProductCard";
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [findProduct, setFindProducto] = useState<IProduct[]>([])
    const [searchCode, setSearchCode] = useState<number | null>(null);
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const token = localStorage.getItem("token") || undefined;

    const getProducts = async (
        page: number,
        category: string = "",
        searchTerm: string = "",
        searchCode: number | null = null
    ) => {
        try {
            const response = await getData({
                token,
                path: `/v1/products/filtered?page=${page}&limit=10&category=${category}&searchTerm=${searchTerm}&code=${searchCode}`,
            });

            if (response.ok && "data" in response) {
                setFilteredProducts(response.data as IProduct[]);
                setTotalPages(response?.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    
    const findExistProduct = async (
        page: number,
        searchTerm: string = "",
    ) => {
        try {
            const response = await getData({
                token,
                path: `/v1/products/filtered?page=${page}&limit=10&category=${""}&searchTerm=${searchTerm}&code=${'null'}`,
            });

            if (response.ok && "data" in response) {
                setFindProducto(response.data as IProduct[]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        getProducts(page, filterByCategory, searchTerm, searchCode);
    }, [page, filterByCategory, searchTerm, searchCode]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            findExistProduct(page, newProduct.name);
        }, 800);
    
        // Limpiar el timeout si newProduct.name cambia antes de 1500ms
        return () => clearTimeout(timer);
    }, [newProduct.name]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
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
        setFilterByCategory(category); // Actualiza la categoría seleccionada
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value); // Actualiza el término de búsqueda
    };
    
    const handleSearchCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCode(parseInt(e.target.value)); // Actualiza el término de búsqueda
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
            getProducts(page);
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
            "image/*": [],
        },
        maxFiles: 1,
    });

 
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
                                    boxShadow:
                                        "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    "&:hover fieldset": {
                                        borderColor: "primary.main",
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            fullWidth
                            label="Buscar por codigo"
                            type="number"
                            variant="outlined"
                            value={searchCode}
                            onChange={handleSearchCode}
                            placeholder="Escribe el codigo de un producto"
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
                                    boxShadow:
                                        "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
                                    boxShadow:
                                        "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: 2,
                                }}
                            >
                                <MenuItem value="asc">Menor a Mayor</MenuItem>
                                <MenuItem value="desc">Mayor a Menor</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Filtro de categoría */}
                    <Grid item xs={12} sm={5} md={3}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={filterByCategory}
                                onChange={handleCategoryFilter}
                                label="Categoría"
                                sx={{
                                    bgcolor: "background.paper",
                                    boxShadow:
                                        "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: 2,
                                }}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                <MenuItem value="Salud">Salud</MenuItem>
                                <MenuItem value="Belleza">Belleza</MenuItem>
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

                    </Grid>
                    <Grid  item xs={12} sm={1}>
                        <a style={{textAlign: "center", width: "100%", display: "block"}} href={BACKEND_URL + "/v1/inventory/download"} download="Inventario-Artemisa.xlsx">
  Descargar inventario
</a>

                    </Grid>
                </Grid>

                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    paddingX="20px"
                    marginBottom="40px"
                >
                    {/* Botón de "Anterior" */}
                    <Button
                        variant="contained"
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Anterior
                    </Button>

                    {/* Lista de números de página con lógica para mostrar solo las cercanas */}
                    {page > 3 && (
                        <>
                            <Button
                                variant="outlined"
                                onClick={() => handlePageChange(1)}
                            >
                                1
                            </Button>
                            <span>...</span>
                        </>
                    )}

                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;

                        // Solo muestra las páginas cercanas a la página actual (3 páginas antes y 3 después)
                        if (pageNumber >= page - 3 && pageNumber <= page + 3) {
                            return (
                                <Button
                                    key={pageNumber}
                                    variant="outlined"
                                    onClick={() => handlePageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        }
                        return null; // No renderiza las páginas fuera del rango
                    })}

                    {page < totalPages - 3 && (
                        <>
                            <span>...</span>
                            <Button
                                variant="outlined"
                                onClick={() => handlePageChange(totalPages)}
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}

                    {/* Botón de "Siguiente" */}
                    <Button
                        variant="contained"
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Siguiente
                    </Button>
                </Grid>

                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    marginBottom={"100px"}
                >
                    {filteredProducts.map((product) => (
                        <ProductCard
                            _id={product._id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            stock={product.stock}
                            key={product._id}
                            picture={product.picture}
                            reload={() => getProducts(page)}
                            buyPrice={product.buyPrice}
                            isStat={false}
                            code={product.code}
                        />
                    ))}
                </Grid>
            </Grid>

            <Grid
                container
                justifyContent="center"
                alignItems="center"
                paddingX="20px"
                marginBottom="40px"
            >
                {/* Botón de "Anterior" */}
                <Button
                    variant="contained"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Anterior
                </Button>

                {/* Lista de números de página con lógica para mostrar solo las cercanas */}
                {page > 3 && (
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => handlePageChange(1)}
                        >
                            1
                        </Button>
                        <span>...</span>
                    </>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    // Solo muestra las páginas cercanas a la página actual (3 páginas antes y 3 después)
                    if (pageNumber >= page - 3 && pageNumber <= page + 3) {
                        return (
                            <Button
                                key={pageNumber}
                                variant="outlined"
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber}
                            </Button>
                        );
                    }
                    return null; // No renderiza las páginas fuera del rango
                })}

                {page < totalPages - 3 && (
                    <>
                        <span>...</span>
                        <Button
                            variant="outlined"
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </Button>
                    </>
                )}

                {/* Botón de "Siguiente" */}
                <Button
                    variant="contained"
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Siguiente
                </Button>
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
                                error={findProduct.length === 1}
                                helperText={findProduct.length === 1 ? `Ya existe un producto con este nombre (#${findProduct[0].code})`: ""}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Compra(en cuanto lo compraste)"
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
                                label="Venta(en cuanto lo venderas)"
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
                        disabled={findProduct.length > 0 || (!newProduct.name && !newProduct.buyPrice && !newProduct.price && !newProduct.stock) }
                    >
                        Añadir producto
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Products;
