package com.fitflow.clover.data.remote.api

import com.fitflow.clover.data.remote.dto.ProductDetailResponse
import com.fitflow.clover.data.remote.dto.ProductPageResponse
import com.fitflow.clover.data.remote.dto.ProductRegisterRequest
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ProductApi {

    // 상품 전체 목록 조회 (No-Offset 무한 스크롤)
    @GET("api/products")
    suspend fun getProducts(
        @Query("lastProductId") lastProductId: Long? = null,
        @Query("size") size: Int = 20
    ): ProductPageResponse

    // 맞춤 체형 상품 추천
    @GET("api/products/recommendations")
    suspend fun getBodyRecommendedProducts(
        @Query("recommendedType") recommendedType: String,
        @Query("size") size: Int = 9
    ): ProductPageResponse

    // 상품 상세 조회
    @GET("api/products/{productId}")
    suspend fun getProductDetail(
        @Path("productId") productId: Long
    ): ProductDetailResponse

    // 상품 등록
    @POST("api/products")
    suspend fun registerProduct(
        @Body body: ProductRegisterRequest
    ): ProductDetailResponse

    // 상품 수정
    @PATCH("api/products/{productId}")
    suspend fun updateProduct(
        @Path("productId") productId: Long,
        @Body body: ProductRegisterRequest
    ): ProductDetailResponse

    // 상품 삭제
    @DELETE("api/products/{productId}")
    suspend fun deleteProduct(
        @Path("productId") productId: Long
    )

    // 찜하기/취소 토글
    @POST("api/products/{productId}/wishlist")
    suspend fun toggleWishlist(
        @Path("productId") productId: Long
    )
}