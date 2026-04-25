# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/lib/android-sdk/tools/proguard/proguard-android.txt
# You can edit the include path preceded by "-include" attribute:
# -include /usr/local/lib/android-sdk/tools/proguard/proguard-android.txt

# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep rules here:

# If your project uses WebView with JS, uncomment the following:
# -keepclassmembers class fqcn.of.javascript.interface.for.webview {
#    public *;
# }

# Disabling optimizations can sometimes help debugging.
# -dontoptimize

# Visualizing control flow is often helpful.
# -dontobfuscate

# Firebase specific rules (if needed, though usually handled by firebase-bom)
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
