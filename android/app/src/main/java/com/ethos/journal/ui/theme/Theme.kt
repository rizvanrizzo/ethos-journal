package com.ethos.journal.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val SageGreen = Color(0xFF7B8365)
private val BrandLight = Color(0xFFF9F7F2)
private val BrandMuted = Color(0xFFF2EDE4)
private val BrandDark = Color(0xFF3D3D33)

private val LightColorScheme = lightColorScheme(
    primary = SageGreen,
    onPrimary = Color.White,
    background = BrandLight,
    surface = Color.White,
    onSurface = BrandDark,
    secondary = BrandMuted
)

@Composable
fun EthosTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
