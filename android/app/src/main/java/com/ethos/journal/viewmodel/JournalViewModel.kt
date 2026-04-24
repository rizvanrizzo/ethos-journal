package com.ethos.journal.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ethos.journal.model.JournalEntry
import com.ethos.journal.model.Mood
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class JournalViewModel : ViewModel() {
    private val db = Firebase.firestore
    private val auth = Firebase.auth
    
    private val _journals = MutableStateFlow<List<JournalEntry>>(emptyList())
    val journals: StateFlow<List<JournalEntry>> = _journals

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading

    fun fetchJournals() {
        val user = auth.currentUser ?: return
        _loading.value = true
        db.collection("journals")
            .whereEqualTo("userId", user.uid)
            .orderBy("createdAt", com.google.firebase.firestore.Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, e ->
                _loading.value = false
                if (e != null) return@addSnapshotListener
                if (snapshot != null) {
                    _journals.value = snapshot.toObjects(JournalEntry::class.java).mapIndexed { index, entry ->
                        entry.copy(id = snapshot.documents[index].id)
                    }
                }
            }
    }

    fun saveJournal(id: String?, title: String, content: String, mood: Mood) {
        val user = auth.currentUser ?: return
        viewModelScope.launch {
            val entry = JournalEntry(
                userId = user.uid,
                title = title,
                content = content,
                mood = mood.label,
                moodEmoji = mood.emoji,
                updatedAt = System.currentTimeMillis()
            )
            
            if (id == null) {
                db.collection("journals").add(entry.copy(createdAt = System.currentTimeMillis())).await()
            } else {
                db.collection("journals").document(id).set(entry).await()
            }
        }
    }

    fun deleteJournal(id: String) {
        viewModelScope.launch {
            db.collection("journals").document(id).delete().await()
        }
    }
}
