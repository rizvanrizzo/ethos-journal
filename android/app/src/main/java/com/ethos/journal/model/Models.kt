package com.ethos.journal.model

data class UserProfile(
    val uid: String = "",
    val email: String = "",
    val displayName: String? = null,
    val photoURL: String? = null
)

enum class Mood(val label: String, val emoji: String) {
    PEACEFUL("peaceful", "🌿"),
    REFLECTIVE("reflective", "✨"),
    EXCITED("excited", "🔥"),
    TENSE("tense", "⚡"),
    GLOOMY("gloomy", "☁️"),
    NEUTRAL("neutral", "🔘");

    companion object {
        fun fromString(value: String): Mood = values().find { it.label == value } ?: NEUTRAL
    }
}

data class JournalEntry(
    val id: String = "",
    val userId: String = "",
    val title: String = "",
    val content: String = "",
    val mood: String = Mood.NEUTRAL.label,
    val moodEmoji: String = Mood.NEUTRAL.emoji,
    val moodExplanation: String? = null,
    val summary: String? = null,
    val suggestion: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
