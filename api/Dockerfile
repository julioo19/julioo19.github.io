
FROM golang:1.27

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy
COPY . . 

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /app-backend

EXPOSE 3000
CMD ["/app-backend"]