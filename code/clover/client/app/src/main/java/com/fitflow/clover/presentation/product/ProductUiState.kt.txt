package com.fitflow.clover.presentation.product

import com.fitflow.clover.domain.modal.ProductDetailModel
import com.fitflow.clover.domain.modal.ProductMainCategory
import com.fitflow.clover.domain.modal.ProductSubCategory
import com.fitflow.clover.domain.modal.ProductSummary
import com.fitflow.clover.domain.modal.ProductSummaryModel

data class ProductListUiState(
    val isLoading: Boolean = false,
    val products: List<ProductSummary> = emptyList(),
    val productModels: List<ProductSummaryModel> = emptyList(),
    val selectedMainCategory: ProductMainCategory = ProductMainCategory.ALL,
    val isMainCategoryExpanded: Boolean = false,
    val selectedSubCategory: ProductSubCategory? = null,
    val isSubCategoryExpanded: Boolean = false,
    val subCategoryList: List<ProductSubCategory> = emptyList(),
    val isLatestOrder: Boolean = true,
    val searchQuery: String = "",
    val errorMessage: String? = null
)

data class TradeUiState(
    val isLoading: Boolean = false,
    val sellingProducts: List<ProductSummary> = emptyList(),
    val soldProducts: List<ProductSummary> = emptyList(),
    val isSellingTabSelected: Boolean = true,
    val errorMessage: String? = null
)

data class ProductEditUiState(
    val isLoading: Boolean = false,
    val isEditMode: Boolean = false,
    val productId: Long? = null,
    val title: String = "",
    val price: String = "",
    val description: String = "",
    val tradeLocation: String = "",
    val size: String = "",
    val fit: String = "",
    val grade: String = "",
    val selectedMainCategory: ProductMainCategory? = null,
    val isMainCategoryExpanded: Boolean = false,
    val selectedSubCategory: ProductSubCategory? = null,
    val isSubCategoryExpanded: Boolean = false,
    val subCategoryList: List<ProductSubCategory> = emptyList(),
    val imageUris: List<String> = emptyList(),
    val isSubmitting: Boolean = false,
    val isSubmitSuccess: Boolean = false,
    val errorMessage: String? = null
) {
    val canAddMoreImages: Boolean
        get() = imageUris.size < MAX_IMAGE_COUNT

    companion object {
        const val MAX_IMAGE_COUNT: Int = 5
    }
}

data class ProductDetailUiState(
    val isLoading: Boolean = false,
    val product: ProductDetailModel? = null,
    val errorMessage: String? = null
)

data class WishlistUiState(
    val isProcessing: Boolean = false,
    val errorMessage: String? = null
)

data class ProductEditFormState(
    val name: String = "",
    val price: String = "",
    val content: String = "",
    val size: String = "",
    val grade: String = "",
    val tradingArea: String = "",
    val recommendedType: String = "",
    val postStatus: String = "ACTIVE",
    val categoryId: String = "",
    val colorId: String = ""
)