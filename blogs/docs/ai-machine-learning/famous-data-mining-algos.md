
---
sidebar_position: 1
---

# Famous Algorithms in Data Mining

Data mining is a broad area that integrates techniques from several fields including machine learning, statistics, pattern recognition, artificial intelligence, and database systems for the analysis of large volumes of data.

The following algorithms are widely recognized as the most influential in the field ([reference: Top 10 Algorithms in Data Mining](https://link.springer.com/article/10.1007/s10115-007-0114-2)).

---

### 1. C4.5 and Beyond
A decision tree algorithm that generates classification rules from data. C4.5 handles both continuous and categorical attributes, deals with missing values, and prunes trees after creation to reduce overfitting. Its successor, C5.0, improves speed and memory usage.

### 2. k-Means
An unsupervised clustering algorithm that partitions $n$ observations into $k$ clusters by iteratively assigning each point to the nearest centroid and recomputing centroids. Simple, fast, and widely used — but sensitive to initial centroid placement and the choice of $k$.

### 3. Support Vector Machines (SVM)
A supervised learning model that finds the optimal hyperplane separating two classes with the maximum margin. SVMs excel on high-dimensional data and, with kernel functions, can model non-linear decision boundaries.

### 4. The Apriori Algorithm
A classic algorithm for mining frequent itemsets and generating association rules (e.g., "customers who buy bread also buy butter"). It uses a level-wise search with candidate generation and pruning based on the downward-closure property.

### 5. Expectation-Maximization (EM)
An iterative method for finding maximum-likelihood estimates when data has latent (hidden) variables. The E-step estimates the hidden variables; the M-step maximizes the likelihood. Commonly used for Gaussian mixture models and missing data problems.

### 6. PageRank
The algorithm behind Google's original search ranking. It models the web as a directed graph and assigns each page a score based on the number and quality of incoming links, using a random-surfer model with a damping factor (typically 0.85).

### 7. AdaBoost
An ensemble method that combines many weak classifiers (e.g., decision stumps) into a strong one. Each iteration re-weights training examples to focus on the ones the current ensemble gets wrong, boosting overall accuracy.

### 8. k-Nearest Neighbors (kNN)
A lazy learning algorithm — it stores all training data and classifies new points by majority vote among the $k$ nearest neighbors (using a distance metric like Euclidean distance). Simple and effective, but can be slow on large datasets.

### 9. Naive Bayes
A probabilistic classifier based on Bayes' theorem with a strong (naive) independence assumption between features. Despite this simplification, it performs surprisingly well on text classification, spam filtering, and sentiment analysis.