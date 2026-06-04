+++
date = '2026-02-03'
draft = false
title = '梯度下降：从数学推导到代码实现'
tags = ['机器学习', '数学', 'Python']
categories = ['AI']
math = true
+++

梯度下降是机器学习中最核心的优化算法。这篇文章从数学原理出发，推导出三种变体，并用 Python 实现一个完整的线性回归训练过程。

<!--more-->

## 优化目标

假设我们有数据集 $\{(x^{(i)}, y^{(i)})\}_{i=1}^{m}$，线性回归的假设函数为：

$$h_\theta(x) = \theta_0 + \theta_1 x$$

损失函数（均方误差）：

$$J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} \left(h_\theta(x^{(i)}) - y^{(i)}\right)^2$$

目标是找到参数 $\theta$ 使 $J(\theta)$ 最小。

## 梯度推导

对 $\theta_j$ 求偏导：

$$\frac{\partial J}{\partial \theta_j} = \frac{1}{m} \sum_{i=1}^{m} \left(h_\theta(x^{(i)}) - y^{(i)}\right) \cdot x_j^{(i)}$$

参数更新规则（同步更新所有 $\theta_j$）：

$$\theta_j \leftarrow \theta_j - \alpha \frac{\partial J}{\partial \theta_j}$$

其中 $\alpha$ 为学习率（learning rate）。

## 三种变体对比

| 算法 | 每次使用样本数 | 优点 | 缺点 |
|------|--------------|------|------|
| 批量梯度下降（BGD） | 全部 $m$ 个 | 稳定收敛 | 数据量大时极慢 |
| 随机梯度下降（SGD） | 1 个 | 更新快 | 震荡剧烈 |
| 小批量梯度下降（Mini-batch） | $b$ 个（如 32） | 折中，GPU 友好 | 需调 batch size |

## Python 实现

```python
import numpy as np
import matplotlib.pyplot as plt

def compute_cost(X, y, theta):
    m = len(y)
    h = X @ theta
    return (1 / (2 * m)) * np.sum((h - y) ** 2)

def gradient_descent(X, y, theta, alpha, epochs):
    m = len(y)
    cost_history = []

    for _ in range(epochs):
        grad = (1 / m) * X.T @ (X @ theta - y)
        theta -= alpha * grad
        cost_history.append(compute_cost(X, y, theta))

    return theta, cost_history

# 生成数据
np.random.seed(42)
m = 100
X_raw = 2 * np.random.rand(m, 1)
y = 4 + 3 * X_raw + np.random.randn(m, 1)

# 加偏置列
X = np.hstack([np.ones((m, 1)), X_raw])
theta = np.zeros((2, 1))

# 训练
theta_opt, history = gradient_descent(X, y, theta, alpha=0.1, epochs=1000)
print(f"θ₀ = {theta_opt[0, 0]:.4f}, θ₁ = {theta_opt[1, 0]:.4f}")
# 输出接近：θ₀ ≈ 4.0, θ₁ ≈ 3.0
```

## 学习率的影响

学习率 $\alpha$ 的选取至关重要：

- $\alpha$ **太小**：收敛极慢，需要大量迭代
- $\alpha$ **太大**：损失函数震荡，甚至发散（$J(\theta)$ 增大）
- **最优**：通常在 $[0.001, 0.1]$ 之间，通过学习率调度动态调整

一个常用的衰减策略：

$$\alpha_t = \frac{\alpha_0}{1 + \text{decay\_rate} \times t}$$

## 收敛判断

当相邻两次迭代的损失差小于阈值 $\epsilon$（如 $10^{-6}$）时认为收敛：

$$|J(\theta^{(t+1)}) - J(\theta^{(t)})| < \epsilon$$

实践中更常见的做法是直接设定固定的 epoch 数，配合早停（Early Stopping）避免过拟合。
