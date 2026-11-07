package com.fitflow.clover.presentation.product

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fitflow.clover.data.remote.api.ProductApi
import com.fitflow.clover.data.repository.ProductRepositoryImpl
import com.fitflow.clover.di.NetworkModule
import com.fitflow.clover.domain.modal.ProductDetailModel
import com.fitflow.clover.domain.modal.ProductImageModel
import com.fitflow.clover.domain.modal.ProductMainCategory
import com.fitflow.clover.domain.modal.ProductSubCategory
import com.fitflow.clover.domain.modal.ProductSummary
import com.fitflow.clover.domain.modal.ProductSummaryModel
import com.fitflow.clover.domain.usecase.ProductUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ProductViewModel(
    private val productUseCase: ProductUseCase = ProductUseCase(
        productRepository = ProductRepositoryImpl(
            productApi = NetworkModule.createApi<ProductApi>()
        )
    )
) : ViewModel() {

    companion object {
        private const val MAX_IMAGE_COUNT = 5
    }

    private var allProducts: List<ProductSummary> = dummyProducts

    private val _listUiState = MutableStateFlow(
        ProductListUiState(
            products = dummyProducts,
            productModels = dummyProductModels
        )
    )
    val listUiState: StateFlow<ProductListUiState> = _listUiState.asStateFlow()

    private val _tradeUiState = MutableStateFlow(
        TradeUiState(
            isSellingTabSelected = true,
            sellingProducts = dummySellingProducts,
            soldProducts = dummySoldProducts
        )
    )
    val tradeUiState: StateFlow<TradeUiState> = _tradeUiState.asStateFlow()

    private val _editUiState = MutableStateFlow(ProductEditUiState())
    val editUiState: StateFlow<ProductEditUiState> = _editUiState.asStateFlow()

    private val _detailUiState = MutableStateFlow(ProductDetailUiState())
    val detailUiState: StateFlow<ProductDetailUiState> = _detailUiState.asStateFlow()

    private val _wishlistUiState = MutableStateFlow(WishlistUiState())
    val wishlistUiState: StateFlow<WishlistUiState> = _wishlistUiState.asStateFlow()

    private val _editFormState = MutableStateFlow(ProductEditFormState())
    val editFormState: StateFlow<ProductEditFormState> = _editFormState.asStateFlow()

    fun loadRecentProducts(size: Int = 9) {
        if (_listUiState.value.isLoading) return

        viewModelScope.launch {
            _listUiState.update {
                it.copy(
                    isLoading = true,
                    errorMessage = null
                )
            }

            runCatching {
                productUseCase.getRecentProducts(size = size)
            }.onSuccess { products ->
                val summaryProducts = products.map { product ->
                    product.toProductSummary()
                }

                allProducts = summaryProducts

                _listUiState.update {
                    it.copy(
                        isLoading = false,
                        products = applyCurrentFilter(
                            source = summaryProducts,
                            state = it
                        ),
                        productModels = products,
                        errorMessage = null
                    )
                }
            }.onFailure { throwable ->
                _listUiState.update {
                    it.copy(
                        isLoading = false,
                        products = filterProducts(
                            main = it.selectedMainCategory,
                            sub = it.selectedSubCategory,
                            latestOrder = it.isLatestOrder
                        ),
                        errorMessage = throwable.message
                    )
                }
            }
        }
    }

    fun loadBodyRecommendedProducts(
        recommendedType: String,
        size: Int = 9
    ) {
        if (_listUiState.value.isLoading) return

        viewModelScope.launch {
            _listUiState.update {
                it.copy(
                    isLoading = true,
                    errorMessage = null
                )
            }

            runCatching {
                productUseCase.getBodyRecommendedProducts(
                    recommendedType = recommendedType,
                    size = size
                )
            }.onSuccess { products ->
                val summaryProducts = products.map { product ->
                    product.toProductSummary()
                }

                allProducts = summaryProducts

                _listUiState.update {
                    it.copy(
                        isLoading = false,
                        products = applyCurrentFilter(
                            source = summaryProducts,
                            state = it
                        ),
                        productModels = products,
                        errorMessage = null
                    )
                }
            }.onFailure { throwable ->
                _listUiState.update {
                    it.copy(
                        isLoading = false,
                        products = filterProducts(
                            main = it.selectedMainCategory,
                            sub = it.selectedSubCategory,
                            latestOrder = it.isLatestOrder
                        ),
                        errorMessage = throwable.message
                    )
                }
            }
        }
    }

    fun loadProductDetail(productId: Long) {
        if (_detailUiState.value.isLoading) return

        viewModelScope.launch {
            _detailUiState.value = ProductDetailUiState(
                isLoading = true,
                product = null,
                errorMessage = null
            )

            runCatching {
                productUseCase.getProductDetail(productId = productId)
            }.onSuccess { product ->
                _detailUiState.value = ProductDetailUiState(
                    isLoading = false,
                    product = product,
                    errorMessage = null
                )
            }.onFailure { throwable ->
                val fallbackProduct = findFallbackProductDetail(
                    productId = productId
                )

                _detailUiState.value = ProductDetailUiState(
                    isLoading = false,
                    product = fallbackProduct,
                    errorMessage = if (fallbackProduct == null) {
                        throwable.message
                    } else {
                        null
                    }
                )
            }
        }
    }

    private fun findFallbackProductDetail(
        productId: Long
    ): ProductDetailModel? {
        val productFromMainHomeModels = mainHomeFallbackProductModels
            .find { product ->
                product.productId == productId
            }
            ?.toProductDetailModel()

        if (productFromMainHomeModels != null) {
            return productFromMainHomeModels
        }

        val productFromCurrentList = allProducts
            .find { product ->
                product.productId == productId
            }
            ?.toProductDetailModel()

        if (productFromCurrentList != null) {
            return productFromCurrentList
        }

        val productFromListModels = _listUiState.value.productModels
            .find { product ->
                product.productId == productId
            }
            ?.toProductDetailModel()

        if (productFromListModels != null) {
            return productFromListModels
        }

        return dummyProductModels
            .find { product ->
                product.productId == productId
            }
            ?.toProductDetailModel()
    }

    fun toggleWishlist() {
        val currentProduct = _detailUiState.value.product ?: return

        if (_wishlistUiState.value.isProcessing) return

        val nextWishlisted = !currentProduct.isWishlisted
        val nextWishlistCount = if (nextWishlisted) {
            currentProduct.wishlistCount + 1
        } else {
            (currentProduct.wishlistCount - 1).coerceAtLeast(0)
        }

        _wishlistUiState.value = WishlistUiState(
            isProcessing = true,
            errorMessage = null
        )

        _detailUiState.update {
            it.copy(
                product = currentProduct.copy(
                    isWishlisted = nextWishlisted,
                    wishlistCount = nextWishlistCount
                )
            )
        }

        _wishlistUiState.value = WishlistUiState(
            isProcessing = false,
            errorMessage = null
        )
    }

    fun clearListError() {
        _listUiState.update {
            it.copy(errorMessage = null)
        }
    }

    fun clearDetailError() {
        _detailUiState.update {
            it.copy(errorMessage = null)
        }
    }

    fun clearWishlistError() {
        _wishlistUiState.update {
            it.copy(errorMessage = null)
        }
    }

    fun onMainCategorySelect(category: ProductMainCategory) {
        val subList = if (category == ProductMainCategory.ALL) {
            emptyList()
        } else {
            ProductSubCategory.getByMainCategory(category)
        }

        _listUiState.update {
            it.copy(
                selectedMainCategory = category,
                isMainCategoryExpanded = false,
                selectedSubCategory = null,
                isSubCategoryExpanded = false,
                subCategoryList = subList,
                products = filterProducts(
                    main = category,
                    sub = null,
                    latestOrder = it.isLatestOrder
                ),
                errorMessage = null
            )
        }
    }

    fun onSubCategorySelect(subCategory: ProductSubCategory) {
        _listUiState.update {
            it.copy(
                selectedSubCategory = subCategory,
                isSubCategoryExpanded = false,
                products = filterProducts(
                    main = it.selectedMainCategory,
                    sub = subCategory,
                    latestOrder = it.isLatestOrder
                ),
                errorMessage = null
            )
        }
    }

    fun onMainCategoryExpandChange(isExpanded: Boolean) {
        _listUiState.update {
            it.copy(isMainCategoryExpanded = isExpanded)
        }
    }

    fun onSubCategoryExpandChange(isExpanded: Boolean) {
        _listUiState.update {
            it.copy(isSubCategoryExpanded = isExpanded)
        }
    }

    fun onFilterClick() {
        _listUiState.update { current ->
            val nextLatestOrder = !current.isLatestOrder

            current.copy(
                isLatestOrder = nextLatestOrder,
                products = filterProducts(
                    main = current.selectedMainCategory,
                    sub = current.selectedSubCategory,
                    latestOrder = nextLatestOrder
                )
            )
        }
    }

    fun onSearchQueryChange(query: String) {
        _listUiState.update { current ->
            current.copy(
                searchQuery = query,
                products = filterProducts(
                    main = current.selectedMainCategory,
                    sub = current.selectedSubCategory,
                    latestOrder = current.isLatestOrder,
                    query = query
                )
            )
        }
    }

    fun onSellingTabClick() {
        _tradeUiState.update {
            it.copy(isSellingTabSelected = true)
        }
    }

    fun onSoldTabClick() {
        _tradeUiState.update {
            it.copy(isSellingTabSelected = false)
        }
    }

    fun onStatusChange(productId: Long) {
        val selling = _tradeUiState.value.sellingProducts.toMutableList()
        val sold = _tradeUiState.value.soldProducts.toMutableList()

        val sellingProduct = selling.find { product ->
            product.productId == productId
        }
        val soldProduct = sold.find { product ->
            product.productId == productId
        }

        when {
            sellingProduct != null -> {
                selling.remove(sellingProduct)
                val completedProduct = sellingProduct.copy(isSold = true)
                sold.add(0, completedProduct)
                updateProductInList(completedProduct)
            }

            soldProduct != null -> {
                sold.remove(soldProduct)
                val sellingAgainProduct = soldProduct.copy(isSold = false)
                selling.add(0, sellingAgainProduct)
                updateProductInList(sellingAgainProduct)
            }
        }

        _tradeUiState.update {
            it.copy(
                sellingProducts = selling,
                soldProducts = sold
            )
        }
    }

    fun onProductDelete(productId: Long) {
        allProducts = allProducts.filter { product ->
            product.productId != productId
        }

        _tradeUiState.update {
            it.copy(
                sellingProducts = it.sellingProducts.filter { product ->
                    product.productId != productId
                },
                soldProducts = it.soldProducts.filter { product ->
                    product.productId != productId
                }
            )
        }

        _listUiState.update {
            it.copy(
                productModels = it.productModels.filter { product ->
                    product.productId != productId
                }
            )
        }

        refreshProductList()
    }

    fun prepareRegister() {
        _editUiState.value = ProductEditUiState(
            isEditMode = false,
            productId = null,
            imageUris = emptyList(),
            isSubmitSuccess = false,
            errorMessage = null
        )

        _editFormState.value = ProductEditFormState()
    }

    fun prepareEdit(productId: Long) {
        val product = allProducts.find { item ->
            item.productId == productId
        }

        if (product == null) {
            _editUiState.value = ProductEditUiState(
                isEditMode = true,
                productId = productId,
                errorMessage = "수정할 상품을 찾을 수 없습니다."
            )
            return
        }

        val subList = ProductSubCategory.getByMainCategory(product.mainCategory)

        _editUiState.value = ProductEditUiState(
            isLoading = false,
            isEditMode = true,
            productId = product.productId,
            title = product.title,
            price = product.price.toString(),
            selectedMainCategory = product.mainCategory,
            selectedSubCategory = product.subCategory,
            subCategoryList = subList,
            imageUris = listOfNotNull(product.thumbnailImageUrl).take(MAX_IMAGE_COUNT),
            isSubmitting = false,
            isSubmitSuccess = false,
            errorMessage = null
        )

        _editFormState.value = ProductEditFormState(
            name = product.title,
            price = product.price.toString(),
            content = "",
            size = "",
            grade = "",
            tradingArea = "",
            recommendedType = "",
            postStatus = if (product.isSold) "SOLD" else "ACTIVE",
            categoryId = product.mainCategory.name,
            colorId = ""
        )
    }

    fun onEditTitleChange(title: String) {
        _editUiState.update {
            it.copy(
                title = title,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(name = title)
        }
    }

    fun onEditPriceChange(price: String) {
        val onlyDigits = price.filter { char ->
            char.isDigit()
        }

        _editUiState.update {
            it.copy(
                price = onlyDigits,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(price = onlyDigits)
        }
    }

    fun onEditDescriptionChange(description: String) {
        _editUiState.update {
            it.copy(
                description = description,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(content = description)
        }
    }

    fun onEditTradeLocationChange(location: String) {
        _editUiState.update {
            it.copy(
                tradeLocation = location,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(tradingArea = location)
        }
    }

    fun onEditSizeChange(size: String) {
        _editUiState.update {
            it.copy(
                size = size,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(size = size)
        }
    }

    fun onEditFitChange(fit: String) {
        _editUiState.update {
            it.copy(
                fit = fit,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(grade = fit)
        }
    }

    fun onEditGradeChange(grade: String) {
        _editUiState.update {
            it.copy(
                grade = grade,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }
    }

    fun onEditMainCategorySelect(category: ProductMainCategory) {
        val subList = if (category == ProductMainCategory.ALL) {
            emptyList()
        } else {
            ProductSubCategory.getByMainCategory(category)
        }

        _editUiState.update {
            it.copy(
                selectedMainCategory = category,
                isMainCategoryExpanded = false,
                selectedSubCategory = null,
                isSubCategoryExpanded = false,
                subCategoryList = subList,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }

        _editFormState.update {
            it.copy(categoryId = category.name)
        }
    }

    fun onEditMainCategoryExpandChange(isExpanded: Boolean) {
        _editUiState.update {
            it.copy(isMainCategoryExpanded = isExpanded)
        }
    }

    fun onEditSubCategorySelect(subCategory: ProductSubCategory) {
        _editUiState.update {
            it.copy(
                selectedSubCategory = subCategory,
                isSubCategoryExpanded = false,
                errorMessage = null,
                isSubmitSuccess = false
            )
        }
    }

    fun onEditSubCategoryExpandChange(isExpanded: Boolean) {
        _editUiState.update {
            it.copy(isSubCategoryExpanded = isExpanded)
        }
    }

    fun onEditImageUrisChange(imageUris: List<String>) {
        _editUiState.update {
            it.copy(
                imageUris = imageUris.distinct().take(MAX_IMAGE_COUNT),
                errorMessage = null,
                isSubmitSuccess = false
            )
        }
    }

    fun onEditImageRemove(imageUri: String) {
        _editUiState.update {
            it.copy(
                imageUris = it.imageUris.filter { uri ->
                    uri != imageUri
                },
                errorMessage = null,
                isSubmitSuccess = false
            )
        }
    }

    fun onTitleChange(title: String) = onEditTitleChange(title)

    fun onPriceChange(price: String) = onEditPriceChange(price)

    fun onDescriptionChange(description: String) = onEditDescriptionChange(description)

    fun onTradeLocationChange(location: String) = onEditTradeLocationChange(location)

    fun onSizeChange(size: String) = onEditSizeChange(size)

    fun onFitChange(fit: String) = onEditFitChange(fit)

    fun onGradeChange(grade: String) = onEditGradeChange(grade)

    fun onImageUrisChange(imageUris: List<String>) = onEditImageUrisChange(imageUris)

    fun submitProduct(onSuccess: () -> Unit = {}) {
        val state = _editUiState.value
        val title = state.title.trim()
        val priceText = state.price.trim()
        val price = priceText.toIntOrNull()
        val mainCategory = state.selectedMainCategory
        val subCategory = state.selectedSubCategory

        when {
            title.isBlank() -> {
                showEditError("상품명을 입력해 주세요.")
                return
            }

            priceText.isBlank() -> {
                showEditError("가격을 입력해 주세요.")
                return
            }

            price == null || price <= 0 -> {
                showEditError("가격은 1원 이상 숫자로 입력해 주세요.")
                return
            }

            mainCategory == null || mainCategory == ProductMainCategory.ALL -> {
                showEditError("대분류를 선택해 주세요.")
                return
            }

            subCategory == null -> {
                showEditError("세부 카테고리를 선택해 주세요.")
                return
            }
        }

        _editUiState.update {
            it.copy(
                isSubmitting = true,
                isSubmitSuccess = false,
                errorMessage = null
            )
        }

        if (state.isEditMode) {
            updateExistingProduct(
                state = state,
                title = title,
                price = price,
                mainCategory = mainCategory,
                subCategory = subCategory,
                onSuccess = onSuccess
            )
        } else {
            registerNewProduct(
                state = state,
                title = title,
                price = price,
                mainCategory = mainCategory,
                subCategory = subCategory,
                onSuccess = onSuccess
            )
        }
    }

    fun onSubmitClick() {
        submitProduct()
    }

    private fun registerNewProduct(
        state: ProductEditUiState,
        title: String,
        price: Int,
        mainCategory: ProductMainCategory,
        subCategory: ProductSubCategory,
        onSuccess: () -> Unit
    ) {
        val newProductId = generateNextProductId()

        val newProduct = ProductSummary(
            productId = newProductId,
            title = title,
            price = price,
            thumbnailImageUrl = state.imageUris.firstOrNull(),
            mainCategory = mainCategory,
            subCategory = subCategory,
            likeCount = 0,
            createdAt = "방금 전",
            isSold = false
        )

        val newProductModel = newProduct.toProductSummaryModel(
            content = state.description,
            size = state.size,
            grade = state.fit,
            tradingArea = state.tradeLocation
        )

        allProducts = listOf(newProduct) + allProducts

        _tradeUiState.update {
            it.copy(
                sellingProducts = listOf(newProduct) + it.sellingProducts
            )
        }

        _listUiState.update {
            it.copy(
                productModels = listOf(newProductModel) + it.productModels
            )
        }

        _editUiState.update {
            it.copy(
                isSubmitting = false,
                isSubmitSuccess = true,
                productId = newProductId,
                errorMessage = null
            )
        }

        refreshProductList()
        onSuccess()
    }

    private fun updateExistingProduct(
        state: ProductEditUiState,
        title: String,
        price: Int,
        mainCategory: ProductMainCategory,
        subCategory: ProductSubCategory,
        onSuccess: () -> Unit
    ) {
        val productId = state.productId

        if (productId == null) {
            _editUiState.update {
                it.copy(
                    isSubmitting = false,
                    isSubmitSuccess = false,
                    errorMessage = "수정할 상품 정보가 없습니다."
                )
            }
            return
        }

        val originProduct = allProducts.find { product ->
            product.productId == productId
        }

        if (originProduct == null) {
            _editUiState.update {
                it.copy(
                    isSubmitting = false,
                    isSubmitSuccess = false,
                    errorMessage = "수정할 상품을 찾을 수 없습니다."
                )
            }
            return
        }

        val editedProduct = originProduct.copy(
            title = title,
            price = price,
            thumbnailImageUrl = state.imageUris.firstOrNull(),
            mainCategory = mainCategory,
            subCategory = subCategory
        )

        val editedProductModel = editedProduct.toProductSummaryModel(
            content = state.description,
            size = state.size,
            grade = state.fit,
            tradingArea = state.tradeLocation
        )

        allProducts = allProducts.map { product ->
            if (product.productId == productId) editedProduct else product
        }

        _tradeUiState.update {
            it.copy(
                sellingProducts = it.sellingProducts.map { product ->
                    if (product.productId == productId) editedProduct.copy(isSold = false) else product
                },
                soldProducts = it.soldProducts.map { product ->
                    if (product.productId == productId) editedProduct.copy(isSold = true) else product
                }
            )
        }

        _listUiState.update {
            it.copy(
                productModels = it.productModels.map { product ->
                    if (product.productId == productId) editedProductModel else product
                }
            )
        }

        _editUiState.update {
            it.copy(
                isSubmitting = false,
                isSubmitSuccess = true,
                errorMessage = null
            )
        }

        refreshProductList()
        onSuccess()
    }

    private fun showEditError(message: String) {
        _editUiState.update {
            it.copy(
                isSubmitting = false,
                isSubmitSuccess = false,
                errorMessage = message
            )
        }
    }

    private fun refreshProductList() {
        _listUiState.update { current ->
            current.copy(
                products = filterProducts(
                    main = current.selectedMainCategory,
                    sub = current.selectedSubCategory,
                    latestOrder = current.isLatestOrder
                )
            )
        }
    }

    private fun applyCurrentFilter(
        source: List<ProductSummary>,
        state: ProductListUiState
    ): List<ProductSummary> {
        val filtered = source.filter { product ->
            val mainMatch = state.selectedMainCategory == ProductMainCategory.ALL ||
                    product.mainCategory == state.selectedMainCategory
            val subMatch = state.selectedSubCategory == null ||
                    product.subCategory == state.selectedSubCategory

            mainMatch && subMatch
        }

        return if (state.isLatestOrder) {
            filtered.sortedByDescending { product ->
                product.productId
            }
        } else {
            filtered.sortedBy { product ->
                product.productId
            }
        }
    }

    private fun filterProducts(
        main: ProductMainCategory,
        sub: ProductSubCategory?,
        latestOrder: Boolean,
        query: String = ""
    ): List<ProductSummary> {
        val filtered = allProducts.filter { product ->
            val mainMatch = main == ProductMainCategory.ALL || product.mainCategory == main
            val subMatch = sub == null || product.subCategory == sub
            val queryMatch = query.isBlank() ||
                    product.title.contains(query, ignoreCase = true) ||
                    product.mainCategory.displayName.contains(query, ignoreCase = true) ||
                    product.subCategory?.displayName?.contains(query, ignoreCase = true) == true

            mainMatch && subMatch && queryMatch
        }

        return if (latestOrder) {
            filtered.sortedByDescending { product ->
                product.productId
            }
        } else {
            filtered.sortedBy { product ->
                product.productId
            }
        }
    }

    private fun updateProductInList(product: ProductSummary) {
        allProducts = allProducts.map { item ->
            if (item.productId == product.productId) product else item
        }

        refreshProductList()
    }

    private fun generateNextProductId(): Long {
        return (
                allProducts +
                        _tradeUiState.value.sellingProducts +
                        _tradeUiState.value.soldProducts
                ).maxOfOrNull { product ->
                product.productId
            }?.plus(1L) ?: 1L
    }
}

private fun ProductSummaryModel.toProductSummary(): ProductSummary {
    val mainCategory = categoryId.toProductMainCategory()
    val subCategory = ProductSubCategory.getByMainCategory(mainCategory).firstOrNull()
        ?: ProductSubCategory.LONG_SLEEVE

    return ProductSummary(
        productId = productId,
        title = name,
        price = price,
        thumbnailImageUrl = thumbnailImageUrl,
        mainCategory = mainCategory,
        subCategory = subCategory,
        likeCount = wishlistCount,
        createdAt = createdAt,
        isSold = postStatus.equals("SOLD", ignoreCase = true)
    )
}

private fun ProductSummary.toProductSummaryModel(
    content: String = "",
    size: String = "",
    grade: String = "",
    tradingArea: String = ""
): ProductSummaryModel {
    return ProductSummaryModel(
        productId = productId,
        sellerId = 0L,
        categoryId = mainCategory.toCategoryId(),
        colorId = null,
        name = title,
        price = price,
        content = content,
        size = size,
        grade = grade,
        tradingArea = tradingArea,
        recommendedType = null,
        postStatus = if (isSold) "SOLD" else "ACTIVE",
        viewCount = 0,
        wishlistCount = likeCount,
        createdAt = createdAt,
        updatedAt = createdAt,
        thumbnailImageUrl = thumbnailImageUrl
    )
}

private fun ProductSummary.toProductDetailModel(): ProductDetailModel {
    return ProductDetailModel(
        productId = productId,
        sellerId = 0L,
        categoryId = mainCategory.toCategoryId(),
        colorId = null,
        name = title,
        price = price,
        content = "",
        size = "",
        grade = "",
        tradingArea = "",
        recommendedType = null,
        postStatus = if (isSold) "SOLD" else "ACTIVE",
        viewCount = 0,
        wishlistCount = likeCount,
        createdAt = createdAt,
        updatedAt = createdAt,
        images = listOfNotNull(
            thumbnailImageUrl?.let { imageUrl ->
                ProductImageModel(
                    imageId = productId,
                    imageUrl = imageUrl,
                    referenceType = "PRODUCT",
                    referenceId = productId,
                    sortOrder = 0,
                    createdAt = createdAt
                )
            }
        ),
        isWishlisted = false
    )
}

private fun ProductSummaryModel.toProductDetailModel(): ProductDetailModel {
    return ProductDetailModel(
        productId = productId,
        sellerId = sellerId,
        categoryId = categoryId,
        colorId = colorId,
        name = name,
        price = price,
        content = content,
        size = size,
        grade = grade,
        tradingArea = tradingArea,
        recommendedType = recommendedType,
        postStatus = postStatus,
        viewCount = viewCount,
        wishlistCount = wishlistCount,
        createdAt = createdAt,
        updatedAt = updatedAt,
        images = listOfNotNull(
            thumbnailImageUrl?.let { imageUrl ->
                ProductImageModel(
                    imageId = productId,
                    imageUrl = imageUrl,
                    referenceType = "PRODUCT",
                    referenceId = productId,
                    sortOrder = 0,
                    createdAt = createdAt
                )
            }
        ),
        isWishlisted = false
    )
}

private fun Long.toProductMainCategory(): ProductMainCategory {
    return when (this) {
        1L -> ProductMainCategory.TOP
        2L -> ProductMainCategory.PANTS
        3L -> ProductMainCategory.OUTER
        4L -> ProductMainCategory.DRESS_SKIRT
        else -> ProductMainCategory.TOP
    }
}

private fun ProductMainCategory.toCategoryId(): Long {
    return when (this) {
        ProductMainCategory.ALL -> 0L
        ProductMainCategory.TOP -> 1L
        ProductMainCategory.PANTS -> 2L
        ProductMainCategory.OUTER -> 3L
        ProductMainCategory.DRESS_SKIRT -> 4L
    }
}

private val dummyProducts = listOf(
    ProductSummary(
        productId = 1L,
        title = "나이키 후드",
        price = 38900,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.TOP,
        subCategory = ProductSubCategory.HOODIE,
        likeCount = 15,
        createdAt = "1분전",
        isSold = false
    ),
    ProductSummary(
        productId = 2L,
        title = "꾸안꾸 티셔츠",
        price = 10000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.TOP,
        subCategory = ProductSubCategory.SHORT_SLEEVE,
        likeCount = 15,
        createdAt = "5분전",
        isSold = false
    ),
    ProductSummary(
        productId = 3L,
        title = "폴로 니트",
        price = 40000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.TOP,
        subCategory = ProductSubCategory.KNIT_SWEATER,
        likeCount = 15,
        createdAt = "10분전",
        isSold = false
    ),
    ProductSummary(
        productId = 4L,
        title = "진청 반바지",
        price = 15000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.PANTS,
        subCategory = ProductSubCategory.SHORT_PANTS,
        likeCount = 15,
        createdAt = "15분전",
        isSold = false
    ),
    ProductSummary(
        productId = 5L,
        title = "데님 슬랙스",
        price = 25000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.PANTS,
        subCategory = ProductSubCategory.SLACKS,
        likeCount = 8,
        createdAt = "20분전",
        isSold = false
    ),
    ProductSummary(
        productId = 6L,
        title = "겨울 패딩",
        price = 55000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.OUTER,
        subCategory = ProductSubCategory.PADDING,
        likeCount = 20,
        createdAt = "30분전",
        isSold = false
    )
)

private val dummySellingProducts = listOf(
    ProductSummary(
        productId = 1L,
        title = "나이키 후드",
        price = 39800,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.TOP,
        subCategory = ProductSubCategory.HOODIE,
        likeCount = 15,
        createdAt = "1분전",
        isSold = false
    ),
    ProductSummary(
        productId = 2L,
        title = "꾸안꾸 티셔츠",
        price = 10000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.TOP,
        subCategory = ProductSubCategory.SHORT_SLEEVE,
        likeCount = 5,
        createdAt = "5분전",
        isSold = false
    ),
    ProductSummary(
        productId = 3L,
        title = "폴로 니트",
        price = 40000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.TOP,
        subCategory = ProductSubCategory.KNIT_SWEATER,
        likeCount = 8,
        createdAt = "10분전",
        isSold = false
    )
)

private val dummySoldProducts = listOf(
    ProductSummary(
        productId = 4L,
        title = "진청 반바지",
        price = 15000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.PANTS,
        subCategory = ProductSubCategory.SHORT_PANTS,
        likeCount = 5,
        createdAt = "15분전",
        isSold = true
    ),
    ProductSummary(
        productId = 5L,
        title = "데님 슬랙스",
        price = 25000,
        thumbnailImageUrl = null,
        mainCategory = ProductMainCategory.PANTS,
        subCategory = ProductSubCategory.SLACKS,
        likeCount = 3,
        createdAt = "20분전",
        isSold = true
    )
)

private val dummyProductModels = dummyProducts.map { product ->
    product.toProductSummaryModel()
}

private val mainHomeFallbackProductModels = listOf(
    ProductSummaryModel(
        productId = 1L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "데님 워싱 자켓",
        price = 39800,
        content = "가볍게 걸치기 좋은 데님 워싱 자켓입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "서울 강남구",
        recommendedType = "BALANCED",
        postStatus = "ACTIVE",
        viewCount = 12,
        wishlistCount = 4,
        createdAt = "방금 전",
        updatedAt = "방금 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 2L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "화이트 셔츠 자켓",
        price = 42000,
        content = "깔끔한 무드의 셔츠형 아우터입니다.",
        size = "L",
        grade = "브랜드",
        tradingArea = "서울 마포구",
        recommendedType = "RECTANGLE",
        postStatus = "ACTIVE",
        viewCount = 18,
        wishlistCount = 6,
        createdAt = "3분 전",
        updatedAt = "3분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 3L,
        sellerId = 1L,
        categoryId = 1L,
        colorId = null,
        name = "블랙 이너 티셔츠",
        price = 19800,
        content = "어디에나 받쳐 입기 좋은 기본 티셔츠입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "서울 성동구",
        recommendedType = "INVERTED_TRIANGLE",
        postStatus = "ACTIVE",
        viewCount = 25,
        wishlistCount = 9,
        createdAt = "8분 전",
        updatedAt = "8분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 4L,
        sellerId = 1L,
        categoryId = 2L,
        colorId = null,
        name = "카고 와이드 팬츠",
        price = 35000,
        content = "활동성이 좋은 와이드 카고 팬츠입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "경기 수원시",
        recommendedType = "TRIANGLE",
        postStatus = "ACTIVE",
        viewCount = 31,
        wishlistCount = 11,
        createdAt = "15분 전",
        updatedAt = "15분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 5L,
        sellerId = 1L,
        categoryId = 2L,
        colorId = null,
        name = "데님 스트레이트 팬츠",
        price = 29000,
        content = "데일리로 입기 좋은 스트레이트 데님 팬츠입니다.",
        size = "L",
        grade = "브랜드",
        tradingArea = "인천 부평구",
        recommendedType = "BALANCED",
        postStatus = "ACTIVE",
        viewCount = 40,
        wishlistCount = 13,
        createdAt = "20분 전",
        updatedAt = "20분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 6L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "라이트 후드 집업",
        price = 27000,
        content = "간절기에 입기 좋은 후드 집업입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "대전 서구",
        recommendedType = "OVAL",
        postStatus = "ACTIVE",
        viewCount = 44,
        wishlistCount = 15,
        createdAt = "30분 전",
        updatedAt = "30분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 7L,
        sellerId = 1L,
        categoryId = 1L,
        colorId = null,
        name = "그레이 니트",
        price = 33000,
        content = "부드러운 착용감의 그레이 니트입니다.",
        size = "FREE",
        grade = "브랜드",
        tradingArea = "서울 송파구",
        recommendedType = "RECTANGLE",
        postStatus = "ACTIVE",
        viewCount = 52,
        wishlistCount = 18,
        createdAt = "45분 전",
        updatedAt = "45분 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 8L,
        sellerId = 1L,
        categoryId = 4L,
        colorId = null,
        name = "미니멀 스커트",
        price = 24000,
        content = "차분한 분위기의 미니멀 스커트입니다.",
        size = "S",
        grade = "브랜드",
        tradingArea = "부산 해운대구",
        recommendedType = "HOURGLASS",
        postStatus = "ACTIVE",
        viewCount = 61,
        wishlistCount = 21,
        createdAt = "1시간 전",
        updatedAt = "1시간 전",
        thumbnailImageUrl = null
    ),
    ProductSummaryModel(
        productId = 9L,
        sellerId = 1L,
        categoryId = 3L,
        colorId = null,
        name = "크롭 블루종",
        price = 46000,
        content = "핏이 예쁜 크롭 블루종 아우터입니다.",
        size = "M",
        grade = "브랜드",
        tradingArea = "광주 서구",
        recommendedType = "BALANCED",
        postStatus = "ACTIVE",
        viewCount = 73,
        wishlistCount = 25,
        createdAt = "2시간 전",
        updatedAt = "2시간 전",
        thumbnailImageUrl = null
    )
)