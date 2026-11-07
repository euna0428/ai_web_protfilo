package com.fitflow.clover.data.repository

import com.fitflow.clover.data.remote.api.ProductApi
import com.fitflow.clover.data.remote.dto.toDomain
import com.fitflow.clover.domain.modal.ProductDetailModel
import com.fitflow.clover.domain.modal.ProductSummaryModel
import com.fitflow.clover.domain.repository.ProductRepository

class ProductRepositoryImpl(
    private val productApi: ProductApi
) : ProductRepository {

    override suspend fun getRecentProducts(size: Int): List<ProductSummaryModel> {
        return productApi.getProducts(size = size)
            .content
            ?.map { it.toDomain() }
            .orEmpty()
    }

    override suspend fun getBodyRecommendedProducts(
        recommendedType: String,
        size: Int
    ): List<ProductSummaryModel> {
        return productApi.getBodyRecommendedProducts(
            recommendedType = recommendedType,
            size = size
        ).content?.map { it.toDomain() }.orEmpty()
    }

    override suspend fun getProductDetail(productId: Long): ProductDetailModel {
        return productApi.getProductDetail(productId).toDomain()
    }

    override suspend fun addWishlist(productId: Long): Boolean {
        productApi.toggleWishlist(productId)
        return true
    }

    override suspend fun removeWishlist(productId: Long): Boolean {
        productApi.toggleWishlist(productId)
        return false
    }
}