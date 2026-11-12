# 💊 Counterfeit Medicine Detection Using Deep Learning and OCR-Based Evidence Extraction

An AI-powered medicine screening system that combines **Deep Learning, Triplet Learning, SVM Classification, and OCR-based text verification** to identify potentially counterfeit medicines using packaging images and extracted textual evidence.

---

## 📌 Project Overview

Counterfeit medicines are a serious public health concern. They can have packaging that closely resembles genuine products, making manual identification difficult.

This project proposes a dual-pipeline detection approach that combines:

- **Visual Detection:** Uses ResNet-18 and Triplet Learning to extract discriminative visual features from medicine packaging.
- **Textual Evidence Extraction:** Uses EasyOCR to extract important medicine information, including medicine name, batch number, manufacturing date, and expiry date.
- **Machine Learning Classification:** Uses an RBF-based Support Vector Machine (SVM) to classify visual embeddings.
- **Decision Fusion:** Combines visual predictions and OCR evidence to support the final genuine or counterfeit prediction.

The objective is to provide a more comprehensive and reliable medicine-packaging screening approach.

## 🎯 Project Objectives

- Detect potentially counterfeit medicines using packaging images.
- Extract meaningful visual features using a pretrained ResNet-18 model.
- Improve visual feature representation through Triplet Learning.
- Classify medicine images using an RBF-SVM classifier.
- Extract medicine-label information using EasyOCR.
- Combine visual and textual evidence for final prediction.

## 🏗️ System Architecture

The proposed system consists of two major processing pipelines.

### 1. Visual Detection Pipeline

The visual pipeline analyzes medicine packaging images.

**Workflow:**

Input Image → Preprocessing → ResNet-18 → 128-D Embedding → Triplet Learning → RBF-SVM → Visual Prediction

**Components:**

- **ResNet-18:** Extracts visual features using a pretrained convolutional neural network.
- **128-D Embedding:** Converts image features into a compact 128-dimensional numerical representation.
- **Triplet Learning:** Learns better feature separation using anchor, positive, and negative samples.
- **RBF-SVM:** Classifies the extracted embeddings into genuine and counterfeit categories.

### 2. OCR Evidence Extraction Pipeline

The OCR pipeline extracts textual information from medicine packaging.

**Workflow:**

Input Image → Image Enhancement → EasyOCR → Text Extraction → Evidence Matching

Information extracted includes:

- Medicine name
- Batch number
- Manufacturing date
- Expiry date
- Brand information

The extracted information is checked against the available medicine information and knowledge base.

### 3. Decision Fusion

The final stage combines:

- Visual prediction from the deep learning pipeline.
- OCR-based textual evidence.

These signals are used to generate the final screening decision.

## 🧠 Models and Technologies Used

| Model / Technology | Purpose |
|---|---|
| ResNet-18 | Visual feature extraction |
| Triplet Learning | Learning discriminative image embeddings |
| 128-D Embeddings | Compact feature representation |
| RBF-SVM | Genuine / counterfeit classification |
| EasyOCR | Text detection and recognition |
| Image Preprocessing | Image resizing, normalization and enhancement |
| Decision Fusion | Combining visual and OCR evidence
