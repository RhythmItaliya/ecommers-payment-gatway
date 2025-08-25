export const PRODUCT_CATEGORIES = {
    ALL: 'all',
    MEN: 'men',
    WOMEN: 'women',
    UNISEX: 'unisex',
    T_SHIRTS: 't-shirts',
    SHIRTS: 'shirts',
    PANTS: 'pants',
    JEANS: 'jeans',
    DRESSES: 'dresses',
    SKIRTS: 'skirts',
    JACKETS: 'jackets',
    HOODIES: 'hoodies',
    SWEATERS: 'sweaters',
    SHORTS: 'shorts',
    SALE: 'sale',
};

export const CATEGORY_LABELS = {
    [PRODUCT_CATEGORIES.ALL]: 'All',
    [PRODUCT_CATEGORIES.MEN]: 'Men',
    [PRODUCT_CATEGORIES.WOMEN]: 'Women',
    [PRODUCT_CATEGORIES.UNISEX]: 'Unisex',
    [PRODUCT_CATEGORIES.T_SHIRTS]: 'T-Shirts',
    [PRODUCT_CATEGORIES.SHIRTS]: 'Shirts',
    [PRODUCT_CATEGORIES.PANTS]: 'Pants',
    [PRODUCT_CATEGORIES.JEANS]: 'Jeans',
    [PRODUCT_CATEGORIES.DRESSES]: 'Dresses',
    [PRODUCT_CATEGORIES.SKIRTS]: 'Skirts',
    [PRODUCT_CATEGORIES.JACKETS]: 'Jackets',
    [PRODUCT_CATEGORIES.HOODIES]: 'Hoodies',
    [PRODUCT_CATEGORIES.SWEATERS]: 'Sweaters',
    [PRODUCT_CATEGORIES.SHORTS]: 'Shorts',
    [PRODUCT_CATEGORIES.SALE]: 'Sale',
};

export const getProductCategory = (product) => {
    if (product.discount > 0) return PRODUCT_CATEGORIES.SALE;
    return product.category || PRODUCT_CATEGORIES.ALL;
};

export const filterProductsByCategory = (products, category) => {
    if (category === PRODUCT_CATEGORIES.ALL) return products;

    switch (category) {
        case PRODUCT_CATEGORIES.MEN:
            return products.filter((item) => item.gender === 'men');
        case PRODUCT_CATEGORIES.WOMEN:
            return products.filter((item) => item.gender === 'women');
        case PRODUCT_CATEGORIES.UNISEX:
            return products.filter((item) => item.gender === 'unisex');
        case PRODUCT_CATEGORIES.T_SHIRTS:
            return products.filter((item) => item.category === 't-shirts');
        case PRODUCT_CATEGORIES.SHIRTS:
            return products.filter((item) => item.category === 'shirts');
        case PRODUCT_CATEGORIES.PANTS:
            return products.filter((item) => item.category === 'pants');
        case PRODUCT_CATEGORIES.JEANS:
            return products.filter((item) => item.category === 'jeans');
        case PRODUCT_CATEGORIES.DRESSES:
            return products.filter((item) => item.category === 'dresses');
        case PRODUCT_CATEGORIES.SKIRTS:
            return products.filter((item) => item.category === 'skirts');
        case PRODUCT_CATEGORIES.JACKETS:
            return products.filter((item) => item.category === 'jackets');
        case PRODUCT_CATEGORIES.HOODIES:
            return products.filter((item) => item.category === 'hoodies');
        case PRODUCT_CATEGORIES.SWEATERS:
            return products.filter((item) => item.category === 'sweaters');
        case PRODUCT_CATEGORIES.SHORTS:
            return products.filter((item) => item.category === 'shorts');
        case PRODUCT_CATEGORIES.SALE:
            return products.filter((item) => item.discount > 0);
        default:
            return products;
    }
};
