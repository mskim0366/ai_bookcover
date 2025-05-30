import React, { useState }
from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import { createBook } from '../services/bookService'; // 방금 만든 createBook 함수 임포트

function BookCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '', // 작가 필드 추가
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 제출 동작 방지
    setLoading(true);
    setError('');

    // 간단한 유효성 검사 (제목은 필수)
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      setLoading(false);
      return;
    }
    if (!formData.author.trim()) {
      setError('작가를 입력해주세요.');
      setLoading(false);
      return;
    }


    try {
      const newBook = await createBook(formData);
      console.log('새 도서 등록 성공:', newBook);
      // 등록 성공 시 도서 목록 페이지로 이동
      navigate('/books'); // 또는 navigate(`/books/${newBook.id}`) 등으로 상세 페이지로 이동 가능
    } catch (err) {
      setError(err.message || '도서 등록에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          새 도서 등록
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="제목"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="작가"
            name="author" // 'author' 필드 추가
            value={formData.author}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="내용"
            name="content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

        
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate(-1)} // 또는 navigate('/books')
            >
          취소
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() =>
            setFormData({
              title: '',
              author: '',
              content: '',
            })
          }
        >
          삭제
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : '저장'}
        </Button>
      </Box>

        </form>
      </Box>
    </Container>
  );
}

export default BookCreatePage;