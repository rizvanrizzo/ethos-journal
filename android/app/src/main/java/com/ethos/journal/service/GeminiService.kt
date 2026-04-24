package com.ethos.journal.service

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

class GeminiService(apiKey: String) {
    private val model = GenerativeModel(
        modelName = "gemini-1.5-flash",
        apiKey = apiKey
    )

    suspend fun summarize(content: String): String? = withContext(Dispatchers.IO) {
        val prompt = "Summarize this journal entry in 2-3 meaningful lines:\n\n$content"
        try {
            val response = model.generateContent(prompt)
            response.text
        } catch (e: Exception) {
            null
        }
    }

    suspend fun detectMood(content: String): MoodAnalysis? = withContext(Dispatchers.IO) {
        val prompt = "Analyze the emotional tone. Return JSON: { \"mood\": \"peaceful|reflective|excited|tense|gloomy|neutral\", \"explanation\": \"...\", \"suggestion\": \"...\" }\n\n$content"
        try {
            val response = model.generateContent(prompt)
            val json = JSONObject(response.text ?: "{}")
            MoodAnalysis(
                mood = json.optString("mood", "neutral"),
                explanation = json.optString("explanation", ""),
                suggestion = json.optString("suggestion", "")
            )
        } catch (e: Exception) {
            null
        }
    }

    suspend fun continueWriting(content: String): String? = withContext(Dispatchers.IO) {
        val prompt = "Continue this journal entry naturally:\n\n$content"
        try {
            val response = model.generateContent(prompt)
            response.text
        } catch (e: Exception) {
            null
        }
    }
}

data class MoodAnalysis(
    val mood: String,
    val explanation: String,
    val suggestion: String
)
