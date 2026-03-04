<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">

<html>
<head>
    <title>SOHI Bakery XML Products</title>
    <style>
        body { font-family: Arial; }
        .product {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 10px;
        }
    </style>
</head>
<body>

<h1>SOHI Bakery Product Catalog (XML)</h1>

<xsl:for-each select="products/product">
    <div class="product">
        <h2><xsl:value-of select="name"/></h2>
        <p><xsl:value-of select="description"/></p>
        <p><strong>Price:</strong> ₱<xsl:value-of select="price"/></p>
        <p><strong>Category:</strong> <xsl:value-of select="category"/></p>
    </div>
</xsl:for-each>

</body>
</html>

</xsl:template>

</xsl:stylesheet>