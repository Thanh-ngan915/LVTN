# import time
# import pandas as pd
# import json
# import os
# import numpy as np
# from tqdm import tqdm
# from dotenv import load_dotenv
# from sklearn.metrics.pairwise import cosine_similarity
# from langchain_community.document_loaders import CSVLoader
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.documents import Document
# from sklearn.model_selection import train_test_split
# from langchain_core.runnables import RunnablePassthrough, RunnableLambda
# #load bien moi truong
# load_dotenv('.env') #load biến môi trường
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") #lấy api
#
# df1 = pd.read_csv("Etsy-dataset-sample.csv").fillna("Không có")
# df2 = pd.read_csv("etsy_handmade_2000(1).csv").fillna("Không có")
#
# df_all = pd.concat([df1, df2], ignore_index=True)
#
# docs = []
# for index, row in df_all.iterrows():
#     raw_title = str(row['title']).replace("FREE SHIPPING-", "").replace("FREE SHIPPING", "").strip()
#     clean_title = raw_title.split(',')[0].strip()
#     item_detail_short = str(row['item_details'])[:300]
#
#     clean_text = (
#         f"passage: Mã sản phẩm (ID): {row['product_id']}. "
#         f"Tên sản phẩm: {clean_title}. "
#         f"Tên cửa hàng (Shop): {row.get('seller_shop_name', 'Không rõ')}. \n"
#         f"Danh mục: {row.get('category_tree', 'Không rõ')}. "
#         f"Giá: {row['final_price']} {row.get('currency', 'USD')}. "
#         f"Mô tả chi tiết: {item_detail_short}. "
#         f"Chính sách giao hàng và trả hàng: {row['shipping_return_policies']}."
#     )
#     meta_data = {
#         "product_id": str(row['product_id']),
#         "url":        str(row['url']),
#         "shop_name":  str(row.get('seller_shop_name', '')),
#         "images_url": str(row.get('images', ''))
#     }
#     docs.append(Document(page_content=clean_text, metadata=meta_data))
#
# print(f"✅ FAISS học toàn bộ {len(docs)} sản phẩm trong DB")
#
# # ✅ Chỉ tách test set để đánh giá chất lượng câu trả lời của Gemini
# df_train, df_test = train_test_split(df_all, test_size=0.2, random_state=42)
# print(f"Tập đánh giá: {len(df_test)} sản phẩm")
#
# # Model embedding miễn phí
# embeddings = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs={'device': 'cpu'}, encode_kwargs={'batch_size': 32})
#
# # Tạo FAISS vectorstore từ CSV documents
# # vectorstore = FAISS.from_documents(docs, embeddings)
# # vectorstore.save_local("faiss_etsy_index_v2")
# # import shutil
# # shutil.copytree("faiss_etsy_index_v2",
# #                 "/content/drive/MyDrive/KLTN/faiss_etsy_index_v2") #/content/drive/MyDrive/KLTN/
# vectorstore = FAISS.load_local(
#     "faiss_etsy_index_v2",
#     embeddings,
#     allow_dangerous_deserialization=True
# )
#
# # Tạo retriever
# retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3, "score_threshold": 0.5})
#
# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.5-flash-lite",
#     temperature=0,
#     google_api_key=GEMINI_API_KEY
# )
#
# # prompt = ChatPromptTemplate.from_template("""
# # Bạn là trợ lý tư vấn sản phẩm.
# # CHỈ sử dụng thông tin trong dữ liệu dưới đây.
#
# # YÊU CẦU NGHIÊM NGẶT:
# # 1. Nếu không tìm thấy sản phẩm nào khớp với mô tả, hãy trả lời: "Rất tiếc, tôi không tìm thấy sản phẩm đúng yêu cầu".
# # 2. CHỈ liệt kê sản phẩm liên quan nếu chúng có cùng loại hoặc cùng phong cách. Nếu không có cái nào thực sự liên quan, KHÔNG ĐƯỢC tự ý bịa ra hoặc lấy đại sản phẩm khác.
# # 3. Nếu dữ liệu mâu thuẫn, hãy báo lại cho người dùng.
#
# # DỮ LIỆU:
# # {context}
#
# # CÂU HỎI: {question}
# # """)
#
# # rag_chain = (
# #     {"context": retriever, "question": RunnablePassthrough()}
# #     | prompt
# #     | llm
# #     | StrOutputParser()
# # )
#
#
# # Hàm nhỏ để tự động dán nhãn "query: " cho FAISS
# def add_query_prefix(question_text):
#     return f"query: {question_text}"
#
# prompt = ChatPromptTemplate.from_template("""
# Dựa vào dữ liệu sau để trả lời:
# {context}
# Câu hỏi: {question}
# """)
#
# def format_docs(docs):
#     # Bỏ chữ "passage: " đi khi đưa cho Gemini đọc cho đỡ rác prompt
#     return "\n\n".join(doc.page_content.replace("passage: ", "") for doc in docs)
#
# # TẠO CHUỖI RAG MỚI TỐI ƯU
# # rag_chain = (
# #     {
# #         # 1. FAISS sẽ nhận câu hỏi đã thêm "query: "
# #         "context": RunnableLambda(add_query_prefix) | retriever | format_docs,
#
# #         # 2. Gemini vẫn nhận câu hỏi gốc bình thường
# #         "question": RunnablePassthrough()
# #     }
# #     | prompt
# #     | llm
# #     | StrOutputParser()
# # )
# import re
# from langchain_core.runnables import RunnablePassthrough, RunnableLambda
#
# # 1. HÀM TRUY VẤN THÔNG MINH
# def smart_retrieve(question):
#     match = re.search(r'(?:shop|cửa hàng)\s+([a-zA-Z0-9_\-\s]+?)(?:\s+sell|\?|$)', question, re.IGNORECASE)
#
#     # Bắt buộc thêm "query: " cho model E5 để tăng độ chính xác vector
#     query_for_faiss = f"query: {question}"
#
#     if match:
#         shop_name = match.group(1).strip()
#         print(f"\n[Hệ thống] -> Đã nhận diện được tên shop: {shop_name}. Đang áp dụng bộ lọc...")
#         docs = vectorstore.similarity_search(
#             query=query_for_faiss, # Dùng câu hỏi đã thêm tiền tố
#             k=5,
#             filter={"shop_name": shop_name}
#         )
#     else:
#         docs = vectorstore.similarity_search(query=query_for_faiss, k=5)
#
#     return "\n\n".join(doc.page_content for doc in docs)
#
# # 2. CẬP NHẬT RAG_CHAIN
# rag_chain = (
#     {
#         "context": RunnableLambda(smart_retrieve), # Cắm hàm thông minh vào đây
#         "question": RunnablePassthrough()
#     }
#     | prompt
#     | llm
#     | StrOutputParser()
# )
#
# """
# =============================================================
# ETSY RAG — TẠO TEST SET & ĐÁNH GIÁ TIẾT KIỆM API
# =============================================================
# Chiến lược tiết kiệm API key:
#   • Chỉ gọi Gemini để BOT TRẢ LỜI (1 call/câu hỏi)
#   • Chấm điểm OFFLINE bằng cosine similarity (0 call)
#   • KHÔNG dùng Gemini làm giám khảo (tiết kiệm 50% call)
#   • Số câu mặc định: 30 câu (6 intent × 5 câu) — tuỳ chỉnh được
#
# Cách dùng:
#   1. Chạy cell 1 → sinh file etsy_test_set.json + etsy_test_set.xlsx
#   2. Chạy cell 2 → bot trả lời + chấm điểm → etsy_eval_results.xlsx
# =============================================================
# """
#
# # ─────────────────────────────────────────────────────────────
# # CELL 1 — SINH TEST SET (KHÔNG CẦN API)
# # ─────────────────────────────────────────────────────────────
#
# import pandas as pd
# import json
# import ast
# import re
# from sklearn.model_selection import train_test_split
#
# # ── 1. ĐỌC VÀ GỘP 2 FILE CSV ────────────────────────────────
# df1 = pd.read_csv("etsy_handmade_2000(1).csv").fillna("Không có")
# df2 = pd.read_csv("Etsy-dataset-sample.csv").fillna("Không có")
#
# # Chuẩn hóa: thêm currency cho df1 nếu thiếu
# if "currency" not in df1.columns:
#     df1["currency"] = "USD"
#
# common_cols = ["product_id", "title", "category_tree", "final_price",
#                "item_details", "shipping_return_policies", "url",
#                "seller_shop_name", "currency"]
#
# df_all = pd.concat([df1[common_cols], df2[common_cols]], ignore_index=True)
# df_all["product_id"] = df_all["product_id"].astype(str)
#
# # Tách 20% test (giữ nguyên random_state để khớp với FAISS index)
# _, df_test = train_test_split(df_all, test_size=0.2, random_state=42)
# print(f"✅ Tổng dataset : {len(df_all)} sản phẩm")
# print(f"✅ Tập test     : {len(df_test)} sản phẩm")
#
# # ── 2. HÀM HELPER ────────────────────────────────────────────
# def clean_title(raw: str) -> str:
#     """Tên sản phẩm ngắn gọn — trước dấu phẩy đầu tiên, tối đa 6 từ."""
#     t = raw.replace("FREE SHIPPING-", "").replace("FREE SHIPPING", "").strip()
#     short = t.split(",")[0].strip()
#     return " ".join(short.split()[:6])
#
# def parse_price(val) -> str:
#     try:
#         return f"{float(val):.2f}"
#     except Exception:
#         return str(val)
#
# def parse_category(cat_str: str) -> str:
#     """Lấy danh mục đầu tiên từ JSON array."""
#     try:
#         lst = ast.literal_eval(str(cat_str))
#         if isinstance(lst, list) and lst:
#             return str(lst[0])
#     except Exception:
#         pass
#     # Fallback: lấy từ đầu tiên trong dấu ngoặc kép
#     m = re.findall(r'"([^"]+)"', cat_str)
#     return m[0] if m else cat_str[:40]
#
# def parse_policy(policy_str: str) -> str:
#     """Trích từ khoá chính sách quan trọng."""
#     p = str(policy_str).lower()
#     keywords = []
#     if "free" in p and "ship" in p:
#         keywords.append("free shipping")
#     if "no return" in p or "not accepted" in p:
#         keywords.append("returns not accepted")
#     elif "return" in p or "exchange" in p:
#         keywords.append("returns accepted")
#     if "made to order" in p:
#         keywords.append("made to order")
#     ships_from = re.search(r"ships from[:\s]+([a-zA-Z ,]+)", p)
#     if ships_from:
#         keywords.append(f"ships from {ships_from.group(1).strip()}")
#     return "; ".join(keywords) if keywords else policy_str[:80]
#
# def short_detail(detail: str, max_chars: int = 180) -> str:
#     return detail[:max_chars].strip()
#
# # ── 3. CẤU HÌNH SỐ CÂU HỎI ─────────────────────────────────
# # Thay đổi N_PER_INTENT để kiểm soát số API call:
# #   5  → 30 câu  (khuyến nghị — tiết kiệm nhất)
# #   10 → 60 câu
# #   20 → 120 câu
# N_PER_INTENT = 5
#
# # ── 4. TẠO TEST DATASET ─────────────────────────────────────
# sample_df = df_test.sample(n=min(N_PER_INTENT * 6, len(df_test)),
#                             random_state=42)
#
# test_dataset = []
#
# for _, row in sample_df.iterrows():
#     pid       = str(row["product_id"])
#     title     = clean_title(str(row["title"]))
#     price     = parse_price(row["final_price"])
#     currency  = str(row.get("currency", "USD"))
#     policy    = parse_policy(str(row["shipping_return_policies"]))
#     detail    = short_detail(str(row["item_details"]))
#     shop      = str(row.get("seller_shop_name", ""))
#     category  = parse_category(str(row["category_tree"]))
#
#     # ── Intent 1: Hỏi GIÁ (câu hỏi tiếng Anh để FAISS dễ match)
#     test_dataset.append({
#         "id"              : f"PRICE_{pid}",
#         "intent"          : "price_inquiry",
#         "question"        : f"How much does {title} cost?",
#         "expected_answer" : f"The price of {title} is {price} {currency}.",
#         "ground_truth_id" : pid,
#         "threshold"       : 0.82,
#         "note"            : "Kiểm tra bot có lấy đúng giá không"
#     })
#
#     # ── Intent 2: Hỏi CHÍNH SÁCH GIAO HÀNG
#     test_dataset.append({
#         "id"              : f"SHIP_{pid}",
#         "intent"          : "policy_check",
#         "question"        : f"What is the shipping and return policy for {title}?",
#         "expected_answer" : policy,
#         "ground_truth_id" : pid,
#         "threshold"       : 0.70,
#         "note"            : "Kiểm tra bot có trích chính sách đúng không"
#     })
#
#     # ── Intent 3: Hỏi CHI TIẾT SẢN PHẨM
#     test_dataset.append({
#         "id"              : f"DETAIL_{pid}",
#         "intent"          : "product_details",
#         "question"        : f"Tell me about {title}",
#         "expected_answer" : detail,
#         "ground_truth_id" : pid,
#         "threshold"       : 0.70,
#         "note"            : "Kiểm tra bot có mô tả sản phẩm đúng không"
#     })
#
#     # ── Intent 4: Hỏi THEO SHOP
#     if shop and shop not in ("Không có", "nan"):
#         test_dataset.append({
#             "id"              : f"SHOP_{pid}",
#             "intent"          : "shop_inquiry",
#             "question"        : f"What products does the shop {shop} sell?",
#             "expected_answer" : f"{title} priced at {price} {currency}.",
#             "ground_truth_id" : pid,
#             "threshold"       : 0.72,
#             "note"            : "Kiểm tra bot có tìm được sản phẩm theo shop không"
#         })
#
#     # ── Intent 5: Hỏi THEO DANH MỤC
#     if category and category not in ("Không có", "nan"):
#         test_dataset.append({
#             "id"              : f"CAT_{pid}",
#             "intent"          : "category_search",
#             "question"        : f"Show me handmade products in the {category} category",
#             "expected_answer" : f"{title} — {price} {currency}",
#             "ground_truth_id" : pid,
#             "threshold"       : 0.70,
#             "note"            : "Kiểm tra bot có tìm đúng danh mục không"
#         })
#
#     # ── Intent 6: Câu hỏi NGOÀI PHẠM VI (Out-of-scope) — 1 câu cố định
# test_dataset.append({
#     "id"              : "OOS_IPHONE",
#     "intent"          : "out_of_scope",
#     "question"        : "Do you sell iPhone 16 Pro?",
#     "expected_answer" : "Sorry, I cannot find this product in our system.",
#     "ground_truth_id" : "N/A",
#     "threshold"       : 0.60,
#     "note"            : "Kiểm tra bot có từ chối đúng câu hỏi ngoài DB không"
# })
#
# # ── 5. LƯU FILE ──────────────────────────────────────────────
# output_json  = "etsy_test_set1.json"
# output_excel = "etsy_test_set1.xlsx"
#
# with open(output_json, "w", encoding="utf-8") as f:
#     json.dump(test_dataset, f, indent=2, ensure_ascii=False)
#
# df_out = pd.DataFrame(test_dataset)
# df_out.to_excel(output_excel, index=False)
#
# # ── 6. THỐNG KÊ ──────────────────────────────────────────────
# print(f"\n{'='*50}")
# print(f"  FILE TEST ĐÃ TẠO XONG")
# print(f"{'='*50}")
# print(f"  Tổng số câu hỏi : {len(test_dataset)}")
# print(f"  Dự kiến API call : {len(test_dataset)} call (1 call/câu)")
# print(f"\n  Phân bổ theo intent:")
# for intent, grp in df_out.groupby("intent"):
#     print(f"    {intent:<20} : {len(grp)} câu")
# print(f"\n  File JSON  : {output_json}")
# print(f"  File Excel : {output_excel}")
# print(f"{'='*50}")
#
# import os
# import json
# import time
# import pandas as pd
# from tqdm import tqdm
# from sklearn.metrics.pairwise import cosine_similarity
#
# # ── CẤU HÌNH ─────────────────────────────────────────────────
# TEST_FILE   = "etsy_test_set.json"
# OUTPUT_FILE = "etsy_eval_results.xlsx"
# SLEEP_SEC   = 20        # Giây nghỉ giữa các lần gọi (free tier: ~8 req/phút)
#
# # Cấu hình khoảng dữ liệu muốn chạy (thay đổi ở đây)
# START_IDX = 150
# END_IDX = 151
#
# # ── ĐỌC TEST SET ──────────────────────────────────────────────
# with open(TEST_FILE, "r", encoding="utf-8") as f:
#     full_data = json.load(f)
#     test_data = full_data[START_IDX:END_IDX] # Cắt đúng đoạn muốn chạy
#
# print(f"📋 Tổng số câu hỏi trong lượt này: {len(test_data)}")
# print(f"⏱  Ước tính thời gian: ~{len(test_data) * SLEEP_SEC // 60} phút")
#
# # ── HÀM GỌI API AN TOÀN (AUTO-RETRY) ─────────────────────────
# def safe_invoke(chain, query, retries=2):
#     wait = 60
#     for i in range(retries):
#         try:
#             return chain.invoke(query)
#         except Exception as e:
#             err = str(e)
#             if "429" in err or "RESOURCE_EXHAUSTED" in err:
#                 print(f"\n⚠️  Quota! Chờ {wait}s... (lần {i+1}/{retries})")
#                 time.sleep(wait)
#             else:
#                 print(f"\n❌ Lỗi khác: {err[:100]}")
#                 return "ERROR"
#     return "ERROR"
#
# # ── HÀM CHẤM ĐIỂM OFFLINE (cosine similarity) ────────────────
# def semantic_score(answer: str, expected: str, embed_fn) -> float:
#     """Tính điểm tương đồng ngữ nghĩa — KHÔNG tốn API."""
#     if answer in ("ERROR", ""):
#         return 0.0
#     refusal_keywords = [
#     "không có thông tin", "không tìm thấy", "không bao gồm",
#     "không có dữ liệu", "xin lỗi", "tôi không biết", "không thể đưa ra", "error",
#     "chưa được cung cấp", "không có thông tin nào về cửa hàng", "không thể đưa ra các gợi ý"
#     ]
#
#     answer_lower = str(answer).lower()
#     for keyword in refusal_keywords:
#         if keyword in answer_lower:
#             # Nếu phát hiện bot đang chối, ÉP điểm về 0.0 và thoát hàm luôn
#             return 0.0
#     v1 = embed_fn(answer[:512])      # giới hạn token
#     v2 = embed_fn(expected[:512])
#     return float(cosine_similarity([v1], [v2])[0][0])
#
# # ── VÒNG LẶP ĐÁNH GIÁ ────────────────────────────────────────
# # ── VÒNG LẶP ĐÁNH GIÁ ────────────────────────────────────────
# results   = []
# error_cnt = 0
#
# for idx, item in enumerate(tqdm(test_data, desc="Evaluating")):
#     question = item["question"]
#
#     # --- BƯỚC MỚI: LẤY CONTEXT ---
#     # Vì rag_chain đang dùng smart_retrieve, ta cũng gọi đúng hàm này
#     # Hàm này đã tự động trả về chuỗi văn bản (không cần join nữa)
#     context_text = smart_retrieve(question)
#     # -------------------------------------------------
#
#     # 1. Bot trả lời (1 API call)
#     bot_answer = safe_invoke(rag_chain, question)
#     if bot_answer == "ERROR":
#         error_cnt += 1
#
#     intent = item["intent"]
#     bot_ans_lower = str(bot_answer).lower()
#
#     # 2. CHẤM ĐIỂM THÔNG MINH (KẾT HỢP LUẬT VÀ COSINE)
#     if intent == "out_of_scope":
#         # Danh sách từ khóa chứng tỏ bot đã biết thân biết phận từ chối
#         refusal_keywords = ["không có thông tin", "không tìm thấy", "sorry", "cannot find", "không có dữ liệu"]
#
#         # Nếu bot có chứa từ khóa từ chối -> Auto 1.0 điểm (Bỏ qua Cosine luôn)
#         if any(kw in bot_ans_lower for kw in refusal_keywords):
#             score = 1.0
#         else:
#             score = 0.0  # Nếu nó dám bịa ra bán iPhone thật thì cho 0 điểm tạch luôn
#     else:
#         # Với các Intent bình thường khác thì vẫn dùng Cosine Similarity chấm như cũ
#         score = semantic_score(
#             str(bot_answer),
#             item["expected_answer"],
#             embeddings.embed_query     # dùng embedding đã load sẵn
#         )
#
#     passed = score >= item["threshold"]
#
#     # 3. Đưa TẤT CẢ vào danh sách kết quả
#     results.append({
#         "id"             : item["id"],
#         "intent"         : intent,
#         "question"       : question,
#         "expected_answer": item["expected_answer"],
#         "bot_answer"     : str(bot_answer),
#         "similarity"     : round(score, 4),
#         "threshold"      : item["threshold"],
#         "passed"         : passed,
#         "ground_truth_id": item["ground_truth_id"],
#         "context"        : context_text,
#         "note"           : item.get("note", ""),
#     })
#
#     # Nghỉ để tránh 429
#     if idx < len(test_data) - 1:
#         time.sleep(SLEEP_SEC)
#
# # ── LƯU KẾT QUẢ VÀ GHI ĐÈ THÔNG MINH ────────────────────────
# df_new = pd.DataFrame(results)
#
# if os.path.exists(OUTPUT_FILE):
#     df_old = pd.read_excel(OUTPUT_FILE)
#
#     # Gộp data cũ và mới
#     df_combined = pd.concat([df_old, df_new], ignore_index=True)
#
#     # Xóa các dòng trùng lặp dựa trên 'id', giữ lại kết quả của lần chạy mới nhất (last)
#     df_res = df_combined.drop_duplicates(subset=['id'], keep='last').reset_index(drop=True)
# else:
#     # Nếu file chưa tồn tại (chạy lần đầu)
#     df_res = df_new
#
# df_res.to_excel(OUTPUT_FILE, index=False)
#
# # ── BÁO CÁO ─────────────────────────────────────────────────
# n = len(df_res)
# acc_overall = df_res["passed"].mean() * 100
#
# print(f"\n{'='*52}")
# print(f"  📊 KẾT QUẢ ĐÁNH GIÁ RAG PIPELINE (TỔNG FILE)")
# print(f"{'='*52}")
# print(f"  Tổng số câu đã test: {n}/{len(full_data)}")
# print(f"  Lỗi API đợt này  : {error_cnt}")
# print(f"  Accuracy (Tổng)  : {acc_overall:.1f}%")
# print(f"  Avg score (Tổng) : {df_res['similarity'].mean():.4f}")
# print(f"{'─'*52}")
# print(f"  Kết quả theo Intent:")
#
# intent_summary = df_res.groupby("intent").agg(
#     N        =("passed", "count"),
#     Accuracy =("passed", lambda x: f"{x.mean()*100:.1f}%"),
#     Avg_score=("similarity", lambda x: f"{x.mean():.4f}"),
# ).reset_index()
#
# for _, row in intent_summary.iterrows():
#     print(f"    {row['intent']:<22} N={row['N']}  "
#           f"Acc={row['Accuracy']}  Score={row['Avg_score']}")
#
# print(f"{'='*52}")
# print(f"  ✅ File kết quả: {OUTPUT_FILE}")
#
# # import json
# # from collections import defaultdict, Counter
#
# # # Đọc file dataset
# # with open("etsy_test_set.json", "r", encoding="utf-8") as f:
# #     data = json.load(f)
#
# # print("=================================")
# # print("📊 DATASET ANALYSIS")
# # print("=================================")
#
# # # 1️⃣ Đếm tổng số câu hỏi
# # total_questions = len(data)
# # print(f"Total questions: {total_questions}")
#
# # # 2️⃣ Kiểm tra ID trùng
# # ids = [item["id"] for item in data]
# # id_counter = Counter(ids)
#
# # duplicate_ids = [i for i, c in id_counter.items() if c > 1]
#
# # print("\n🔎 Duplicate ID check")
# # print(f"Duplicate IDs: {len(duplicate_ids)}")
#
# # if duplicate_ids:
# #     for i in duplicate_ids:
# #         print(f" - {i} appears {id_counter[i]} times")
#
# # # 3️⃣ Kiểm tra expected_answer conflict theo ground_truth_id
# # answers_by_gt = defaultdict(set)
#
# # for item in data:
# #     gt_id = item["ground_truth_id"]
# #     ans = item["expected_answer"]
# #     answers_by_gt[gt_id].add(ans)
#
# # conflicts = {k: v for k, v in answers_by_gt.items() if len(v) > 1}
#
# # print("\n⚠️ Expected Answer Conflicts")
# # print(f"Conflicted ground_truth_id: {len(conflicts)}")
#
# # for gt_id, answers in conflicts.items():
# #     print(f"\nGround Truth ID: {gt_id}")
# #     for a in answers:
# #         print(" -", a)
#
# # print("\n✅ Dataset check completed.")
#
# # import pandas as pd
# # from collections import defaultdict, Counter
#
# # # Đọc file Excel
# # df = pd.read_excel("etsy_eval_results.xlsx")
#
# # # Convert sang list dict giống JSON
# # data = df.to_dict(orient="records")
#
# # print("=================================")
# # print("📊 DATASET ANALYSIS")
# # print("=================================")
#
# # # 1️⃣ Đếm tổng số câu hỏi
# # total_questions = len(data)
# # print(f"Total questions: {total_questions}")
#
# # # 2️⃣ Kiểm tra ID trùng
# # ids = [item["id"] for item in data]
# # id_counter = Counter(ids)
#
# # duplicate_ids = [i for i, c in id_counter.items() if c > 1]
#
# # print("\n🔎 Duplicate ID check")
# # print(f"Duplicate IDs: {len(duplicate_ids)}")
#
# # if duplicate_ids:
# #     for i in duplicate_ids:
# #         print(f" - {i} appears {id_counter[i]} times")
#
# # # 3️⃣ Kiểm tra expected_answer conflict theo ground_truth_id
# # answers_by_gt = defaultdict(set)
#
# # for item in data:
# #     gt_id = item["ground_truth_id"]
# #     ans = str(item["expected_answer"])
# #     answers_by_gt[gt_id].add(ans)
#
# # conflicts = {k: v for k, v in answers_by_gt.items() if len(v) > 1}
#
# # print("\n⚠️ Expected Answer Conflicts")
# # print(f"Conflicted ground_truth_id: {len(conflicts)}")
#
# # for gt_id, answers in conflicts.items():
# #     print(f"\nGround Truth ID: {gt_id}")
# #     for a in answers:
# #         print(" -", a)
#
# # print("\n✅ Dataset check completed.")
#
# # models_to_try = [
# #     "gemini-2.5-flash",
# #     "gemini-2.5-flash-lite",
# #     "gemini-2.0-flash-001",
# #     "gemini-2.0-flash-lite-001",
# #     "gemini-flash-latest",
# #     "gemini-flash-lite-latest",
# # ]
#
# # for model_name in models_to_try:
# #     try:
# #         test_llm = ChatGoogleGenerativeAI(
# #             model=model_name,
# #             temperature=0,
# #             google_api_key=GEMINI_API_KEY
# #         )
# #         res = test_llm.invoke("Say hi in one word")
# #         print(f"✅ {model_name} : {res.content}")
# #     except Exception as e:
# #         err = str(e)
# #         if "429" in err:
# #             print(f"⚠️  {model_name} : hết quota")
# #         elif "404" in err:
# #             print(f"❌ {model_name} : không tìm thấy")
# #         else:
# #             print(f"❌ {model_name} : {err[:80]}")
#
# # import pandas as pd
#
# # # ── ĐỌC FILE KẾT QUẢ ─────────────────────────────────────────
# # df = pd.read_excel("etsy_eval_results.xlsx")
#
# # # ── TỔNG QUAN ────────────────────────────────────────────────
# # n         = len(df)
# # passed    = df["passed"].sum()
# # failed    = n - passed
# # accuracy  = df["passed"].mean() * 100
# # avg_score = df["similarity"].mean()
#
# # print(f"\n{'='*52}")
# # print(f"  📊 ĐÁNH GIÁ ĐỘ CHÍNH XÁC GEMINI RAG")
# # print(f"{'='*52}")
# # print(f"  Tổng câu hỏi : {n}")
# # print(f"  Đúng (passed): {passed}")
# # print(f"  Sai (failed) : {failed}")
# # print(f"  Accuracy     : {accuracy:.1f}%")
# # print(f"  Avg similarity: {avg_score:.4f}")
# # print(f"{'─'*52}")
#
# # # ── THEO INTENT ──────────────────────────────────────────────
# # print(f"  Theo Intent:")
# # intent_summary = df.groupby("intent").agg(
# #     Tổng      = ("passed", "count"),
# #     Đúng      = ("passed", "sum"),
# #     Accuracy  = ("passed", lambda x: f"{x.mean()*100:.1f}%"),
# #     Avg_score = ("similarity", lambda x: f"{x.mean():.4f}"),
# # ).reset_index()
#
# # for _, row in intent_summary.iterrows():
# #     print(f"    {row['intent']:<22} "
# #           f"{row['Đúng']}/{row['Tổng']} câu  "
# #           f"Acc={row['Accuracy']}  Score={row['Avg_score']}")
#
# # print(f"{'─'*52}")
#
# # # ── CÁC CÂU SAI ──────────────────────────────────────────────
# # df_fail = df[df["passed"] == False]
# # print(f"\n  ❌ Chi tiết {len(df_fail)} câu sai:")
# # for _, row in df_fail.iterrows():
# #     print(f"\n  [{row['id']}]")
# #     print(f"  Q      : {row['question']}")
# #     print(f"  Expected: {str(row['expected_answer'])[:80]}...")
# #     print(f"  Bot    : {str(row['bot_answer'])[:80]}...")
# #     print(f"  Score  : {row['similarity']:.4f} < threshold {row['threshold']}")
#
# # print(f"\n{'='*52}")
# # print(f"  ✅ Tổng kết: Gemini trả lời đúng {passed}/{n} câu ({accuracy:.1f}%)")
# # print(f"{'='*52}")
#
# import pandas as pd
#
# # ── ĐỌC FILE KẾT QUẢ ─────────────────────────────────────────
# df = pd.read_excel("etsy_eval_results.xlsx")
#
# # ── TỔNG QUAN ────────────────────────────────────────────────
# n         = len(df)
# passed    = df["passed"].sum()
# failed    = n - passed
# accuracy  = df["passed"].mean() * 100
# avg_score = df["similarity"].mean()
#
# print(f"\n{'='*52}")
# print(f"  📊 ĐÁNH GIÁ ĐỘ CHÍNH XÁC GEMINI RAG")
# print(f"{'='*52}")
# print(f"  Tổng câu hỏi : {n}")
# print(f"  Đúng (passed): {passed}")
# print(f"  Sai (failed) : {failed}")
# print(f"  Accuracy     : {accuracy:.1f}%")
# print(f"  Avg similarity: {avg_score:.4f}")
# print(f"{'─'*52}")
#
# # ── THEO INTENT ──────────────────────────────────────────────
# print(f"  Theo Intent:")
# intent_summary = df.groupby("intent").agg(
#     Tổng      = ("passed", "count"),
#     Đúng      = ("passed", "sum"),
#     Accuracy  = ("passed", lambda x: f"{x.mean()*100:.1f}%"),
#     Avg_score = ("similarity", lambda x: f"{x.mean():.4f}"),
# ).reset_index()
#
# for _, row in intent_summary.iterrows():
#     print(f"    {row['intent']:<22} "
#           f"{row['Đúng']}/{row['Tổng']} câu  "
#           f"Acc={row['Accuracy']}  Score={row['Avg_score']}")
#
# print(f"{'─'*52}")
#
# # ── CÁC CÂU SAI ──────────────────────────────────────────────
# df_fail = df[df["passed"] == False]
# print(f"\n  ❌ Chi tiết {len(df_fail)} câu sai:")
# for _, row in df_fail.iterrows():
#     print(f"\n  [{row['id']}]")
#     print(f"  Q      : {row['question']}")
#     print(f"  Expected: {str(row['expected_answer'])[:80]}...")
#     print(f"  Bot    : {str(row['bot_answer'])[:80]}...")
#     print(f"  Score  : {row['similarity']:.4f} < threshold {row['threshold']}")
#
# print(f"\n{'='*52}")
# print(f"  ✅ Tổng kết: Gemini trả lời đúng {passed}/{n} câu ({accuracy:.1f}%)")
# print(f"{'='*52}")
#
# # # Tìm kiếm bằng CHUỖI (CÓ ngoặc kép)
# # sp_loi = df_all[df_all['product_id'] == "1786877089"]
#
# # if len(sp_loi) > 0:
# #     print("✅ Đã tìm thấy sản phẩm:")
# #     print("Tên:", sp_loi['title'].values[0])
# #     print("Shop:", sp_loi['seller_shop_name'].values[0])
# #     print("Mô tả:", sp_loi['item_details'].values[0])
# # else:
# #     print("❌ BÓ TAY THỰC SỰ!")
#
# # import pandas as pd
# # import numpy as np
# # from tqdm import tqdm
# # from sklearn.metrics.pairwise import cosine_similarity
# # from langchain_huggingface import HuggingFaceEmbeddings
#
# # # ── 1. KHỞI TẠO MÔ HÌNH EMBEDDING (Chạy offline, miễn phí) ─────────
# # print("⏳ Đang tải mô hình Embedding (multilingual-e5-large)...")
# # embeddings = HuggingFaceEmbeddings(
# #     model_name="intfloat/multilingual-e5-large",
# #     model_kwargs={'device': 'cpu'}
# # )
#
# # # ── 2. ĐỌC FILE KẾT QUẢ BẠN VỪA UPLOAD ─────────────────────────────
# # file_name = "etsy_eval_results.xlsx"
# # try:
# #     df = pd.read_excel(file_name)
# #     print(f"✅ Đã đọc thành công {len(df)} dòng từ file {file_name}")
# # except FileNotFoundError:
# #     print(f"❌ Lỗi: Không tìm thấy file '{file_name}'. Hãy kiểm tra lại thư mục hiện tại của Colab.")
#
# # # ── 3. HÀM TÍNH ĐIỂM (TÍCH HỢP BỘ LỌC CHỐNG ĐIỂM ẢO) ───────────────
# # refusal_keywords = [
# #     "không có thông tin", "không tìm thấy", "không bao gồm",
# #     "không có dữ liệu", "xin lỗi", "tôi không biết", "không thể đưa ra", "error"
# # ]
#
# # def get_cosine_score(text1, text2):
# #     """Tính độ tương đồng Cosine giữa 2 chuỗi"""
# #     if pd.isna(text1) or pd.isna(text2) or str(text1).strip() == "" or str(text2).strip() == "":
# #         return 0.0
# #     vec1 = embeddings.embed_query(str(text1)[:512])
# #     vec2 = embeddings.embed_query(str(text2)[:512])
# #     return float(cosine_similarity([vec1], [vec2])[0][0])
#
# # correctness_scores = []
# # relevance_scores = []
# # faithfulness_scores = []
#
# # has_context = 'context' in df.columns
#
# # print("⚙️ Đang tính toán điểm RAG Triad...")
# # for index, row in tqdm(df.iterrows(), total=len(df)):
# #     question = str(row.get('question', ''))
# #     expected = str(row.get('expected_answer', ''))
# #     bot_answer = str(row.get('bot_answer', ''))
#
# #     bot_lower = bot_answer.lower()
# #     exp_lower = expected.lower()
#
# #     # Kiểm tra Bot hoặc Đáp án có đang từ chối trả lời không
# #     is_bot_refusal = any(kw in bot_lower for kw in refusal_keywords)
# #     is_exp_refusal = any(kw in exp_lower for kw in refusal_keywords)
#
# #     # -- QUY TẮC ÉP ĐIỂM QA (HEURISTICS) --
# #     if "error" in bot_lower:
# #         c_score = r_score = f_score = 0.0
# #     elif is_bot_refusal and is_exp_refusal:
# #         c_score = r_score = f_score = 1.0  # Chối đúng lúc -> 10 điểm
# #     elif is_bot_refusal and not is_exp_refusal:
# #         c_score = r_score = f_score = 0.0  # Chối sai -> 0 điểm
# #     else:
# #         # Tính điểm bằng vector (nhân 10 để ra thang điểm 10)
# #         c_score = get_cosine_score(bot_answer, expected) * 10
# #         r_score = get_cosine_score(bot_answer, question) * 10
#
# #         # Nếu có cột context thì tính Faithfulness
# #         if has_context:
# #             context = str(row.get('context', ''))
# #             f_score = get_cosine_score(bot_answer, context) * 10
# #         else:
# #             f_score = None
#
# #     correctness_scores.append(round(c_score, 2))
# #     relevance_scores.append(round(r_score, 2))
# #     if has_context:
# #         faithfulness_scores.append(round(f_score, 2))
#
# # # Ghi điểm vào DataFrame
# # df["Correctness (0-10)"] = correctness_scores
# # df["Relevance (0-10)"] = relevance_scores
# # if has_context:
# #     df["Faithfulness (0-10)"] = faithfulness_scores
#
# # # ── 4. XUẤT BÁO CÁO KLTN ───────────────────────────────────────────
# # output_file = "RAG_Triad_Evaluation_Results.csv"
# # df.to_csv(output_file, index=False)
#
# # print(f"\n{'='*52}")
# # print(f" 📊 BÁO CÁO ĐIỂM RAG TRIAD (Vector Cosine)")
# # print(f"{'='*52}")
# # print(f" Correctness (Tính chính xác) : {df['Correctness (0-10)'].mean():.2f}/10")
# # print(f" Relevance   (Đúng trọng tâm) : {df['Relevance (0-10)'].mean():.2f}/10")
#
# # if has_context:
# #     print(f" Faithfulness(Tính trung thực): {df['Faithfulness (0-10)'].mean():.2f}/10")
# # else:
# #     print(f"\n⚠️ CẢNH BÁO: File CSV không có cột 'context'.")
# #     print(f"   Hệ thống không thể tính điểm Faithfulness (Tính trung thực).")
# #     print(f"   Để tính tiêu chí này, bạn cần lưu lại văn bản mà FAISS tìm được vào file kết quả.")
#
# # print(f"{'─'*52}")
# # print(f" ✅ Đã lưu file kết quả chi tiết: {output_file}")
#
# import pandas as pd
# import numpy as np
# from tqdm import tqdm
# from sklearn.metrics.pairwise import cosine_similarity
# from langchain_huggingface import HuggingFaceEmbeddings
#
# # ── 1. KHỞI TẠO MÔ HÌNH EMBEDDING (Chạy offline, miễn phí) ─────────
# print("⏳ Đang tải mô hình Embedding (multilingual-e5-large)...")
# embeddings = HuggingFaceEmbeddings(
#     model_name="intfloat/multilingual-e5-large",
#     model_kwargs={'device': 'cpu'}
# )
#
# # ── 2. ĐỌC FILE KẾT QUẢ BẠN VỪA UPLOAD ─────────────────────────────
# file_name = "etsy_eval_results.xlsx"
# try:
#     df = pd.read_excel(file_name)
#     print(f"✅ Đã đọc thành công {len(df)} dòng từ file {file_name}")
# except FileNotFoundError:
#     print(f"❌ Lỗi: Không tìm thấy file '{file_name}'. Hãy kiểm tra lại thư mục hiện tại của Colab.")
#
# # ── 3. HÀM TÍNH ĐIỂM (TÍCH HỢP BỘ LỌC CHỐNG ĐIỂM ẢO) ───────────────
# refusal_keywords = [
#     "không có thông tin", "không tìm thấy", "không bao gồm",
#     "không có dữ liệu", "xin lỗi", "tôi không biết", "không thể đưa ra", "error"
# ]
#
# def get_cosine_score(text1, text2):
#     """Tính độ tương đồng Cosine giữa 2 chuỗi"""
#     if pd.isna(text1) or pd.isna(text2) or str(text1).strip() == "" or str(text2).strip() == "":
#         return 0.0
#     vec1 = embeddings.embed_query(str(text1))
#     vec2 = embeddings.embed_query(str(text2))
#     return float(cosine_similarity([vec1], [vec2])[0][0])
#
# correctness_scores = []
# relevance_scores = []
# faithfulness_scores = []
#
# has_context = 'context' in df.columns
#
# print("⚙️ Đang tính toán điểm RAG Triad...")
# for index, row in tqdm(df.iterrows(), total=len(df)):
#     question = str(row.get('question', ''))
#     expected = str(row.get('expected_answer', ''))
#     bot_answer = str(row.get('bot_answer', ''))
#
#     bot_lower = bot_answer.lower()
#     exp_lower = expected.lower()
#
#     # Kiểm tra Bot hoặc Đáp án có đang từ chối trả lời không
#     is_bot_refusal = any(kw in bot_lower for kw in refusal_keywords)
#     is_exp_refusal = any(kw in exp_lower for kw in refusal_keywords)
#
#     # -- QUY TẮC ÉP ĐIỂM QA (HEURISTICS) --
#     if "error" in bot_lower:
#         c_score = r_score = f_score = 0.0
#     elif is_bot_refusal and is_exp_refusal:
#         c_score = r_score = f_score = 1.0  # Chối đúng lúc -> 10 điểm
#     elif is_bot_refusal and not is_exp_refusal:
#         c_score = r_score = f_score = 0.0  # Chối sai -> 0 điểm
#     else:
#         # Tính điểm bằng vector (nhân 10 để ra thang điểm 10)
#         c_score = get_cosine_score(bot_answer, expected) * 10
#         r_score = get_cosine_score(bot_answer, question) * 10
#
#         # Nếu có cột context thì tính Faithfulness
#         if has_context:
#             context = str(row.get('context', ''))
#             f_score = get_cosine_score(bot_answer, context) * 10
#         else:
#             f_score = None
#
#     correctness_scores.append(round(c_score, 2))
#     relevance_scores.append(round(r_score, 2))
#     if has_context:
#         faithfulness_scores.append(round(f_score, 2))
#
# # Ghi điểm vào DataFrame
# df["Correctness (0-10)"] = correctness_scores
# df["Relevance (0-10)"] = relevance_scores
# if has_context:
#     df["Faithfulness (0-10)"] = faithfulness_scores
#
# # ── 4. XUẤT BÁO CÁO KLTN ───────────────────────────────────────────
# output_file = "RAG_Triad_Evaluation_Results.csv"
# df.to_csv(output_file, index=False)
#
# print(f"\n{'='*52}")
# print(f" 📊 BÁO CÁO ĐIỂM RAG TRIAD (Vector Cosine)")
# print(f"{'='*52}")
# print(f" Correctness (Tính chính xác) : {df['Correctness (0-10)'].mean():.2f}/10")
# print(f" Relevance   (Đúng trọng tâm) : {df['Relevance (0-10)'].mean():.2f}/10")
#
# if has_context:
#     print(f" Faithfulness(Tính trung thực): {df['Faithfulness (0-10)'].mean():.2f}/10")
# else:
#     print(f"\n⚠️ CẢNH BÁO: File CSV không có cột 'context'.")
#     print(f"   Hệ thống không thể tính điểm Faithfulness (Tính trung thực).")
#     print(f"   Để tính tiêu chí này, bạn cần lưu lại văn bản mà FAISS tìm được vào file kết quả.")
#
# print(f"{'─'*52}")
# print(f" ✅ Đã lưu file kết quả chi tiết: {output_file}")
#
# import pandas as pd
# import numpy as np
# from tqdm import tqdm
# from sklearn.metrics.pairwise import cosine_similarity
# from langchain_huggingface import HuggingFaceEmbeddings
#
# # ── 1. KHỞI TẠO MÔ HÌNH EMBEDDING (Chạy offline, miễn phí) ─────────
# print("⏳ Đang tải mô hình Embedding (multilingual-e5-large)...")
# embeddings = HuggingFaceEmbeddings(
#     model_name="intfloat/multilingual-e5-large",
#     model_kwargs={'device': 'cpu'}
# )
#
# # ── 2. ĐỌC FILE KẾT QUẢ BẠN VỪA UPLOAD ─────────────────────────────
# file_name = "etsy_eval_results.xlsx"
# try:
#     df = pd.read_excel(file_name)
#     print(f"✅ Đã đọc thành công {len(df)} dòng từ file {file_name}")
# except FileNotFoundError:
#     print(f"❌ Lỗi: Không tìm thấy file '{file_name}'. Hãy kiểm tra lại thư mục hiện tại của Colab.")
#
# # ── 3. HÀM TÍNH ĐIỂM (TÍCH HỢP BỘ LỌC CHỐNG ĐIỂM ẢO) ───────────────
# refusal_keywords = [
#     "không có thông tin", "không tìm thấy", "không bao gồm",
#     "không có dữ liệu", "xin lỗi", "tôi không biết", "không thể đưa ra", "error"
# ]
#
# def get_cosine_score(text1, text2):
#     """Tính độ tương đồng Cosine giữa 2 chuỗi"""
#     if pd.isna(text1) or pd.isna(text2) or str(text1).strip() == "" or str(text2).strip() == "":
#         return 0.0
#     vec1 = embeddings.embed_query(str(text1))
#     vec2 = embeddings.embed_query(str(text2))
#     return float(cosine_similarity([vec1], [vec2])[0][0])
#
# correctness_scores = []
# relevance_scores = []
# faithfulness_scores = []
#
# has_context = 'context' in df.columns
#
# print("⚙️ Đang tính toán điểm RAG Triad...")
# for index, row in tqdm(df.iterrows(), total=len(df)):
#     question = str(row.get('question', ''))
#     expected = str(row.get('expected_answer', ''))
#     bot_answer = str(row.get('bot_answer', ''))
#
#     bot_lower = bot_answer.lower()
#     exp_lower = expected.lower()
#
#     # Kiểm tra Bot hoặc Đáp án có đang từ chối trả lời không
#     is_bot_refusal = any(kw in bot_lower for kw in refusal_keywords)
#     is_exp_refusal = any(kw in exp_lower for kw in refusal_keywords)
#
#     # -- QUY TẮC ÉP ĐIỂM QA (HEURISTICS) --
#     if "error" in bot_lower:
#         c_score = r_score = f_score = 0.0
#     elif is_bot_refusal and is_exp_refusal:
#         c_score = r_score = f_score = 1.0  # Chối đúng lúc -> 10 điểm
#     elif is_bot_refusal and not is_exp_refusal:
#         c_score = r_score = f_score = 0.0  # Chối sai -> 0 điểm
#     else:
#         # Tính điểm bằng vector (nhân 10 để ra thang điểm 10)
#         c_score = get_cosine_score(bot_answer, expected) * 10
#         r_score = get_cosine_score(bot_answer, question) * 10
#
#         # Nếu có cột context thì tính Faithfulness
#         if has_context:
#             context = str(row.get('context', ''))
#             f_score = get_cosine_score(bot_answer, context) * 10
#         else:
#             f_score = None
#
#     correctness_scores.append(round(c_score, 2))
#     relevance_scores.append(round(r_score, 2))
#     if has_context:
#         faithfulness_scores.append(round(f_score, 2))
#
# # Ghi điểm vào DataFrame
# df["Correctness (0-10)"] = correctness_scores
# df["Relevance (0-10)"] = relevance_scores
# if has_context:
#     df["Faithfulness (0-10)"] = faithfulness_scores
#
# # ── 4. XUẤT BÁO CÁO KLTN ───────────────────────────────────────────
# output_file = "RAG_Triad_Evaluation_Results.csv"
# df.to_csv(output_file, index=False)
#
# print(f"\n{'='*52}")
# print(f" 📊 BÁO CÁO ĐIỂM RAG TRIAD (Vector Cosine)")
# print(f"{'='*52}")
# print(f" Correctness (Tính chính xác) : {df['Correctness (0-10)'].mean():.2f}/10")
# print(f" Relevance   (Đúng trọng tâm) : {df['Relevance (0-10)'].mean():.2f}/10")
#
# if has_context:
#     print(f" Faithfulness(Tính trung thực): {df['Faithfulness (0-10)'].mean():.2f}/10")
# else:
#     print(f"\n⚠️ CẢNH BÁO: File CSV không có cột 'context'.")
#     print(f"   Hệ thống không thể tính điểm Faithfulness (Tính trung thực).")
#     print(f"   Để tính tiêu chí này, bạn cần lưu lại văn bản mà FAISS tìm được vào file kết quả.")
#
# print(f"{'─'*52}")
# print(f" ✅ Đã lưu file kết quả chi tiết: {output_file}")
#
# # # Truy vấn 1
# # query1 = "give me the price of 925 sterling silver cuban link bracelet men's"
# # result1 = rag_chain.invoke(query1) # Sử dụng .invoke()
# # print("Q:", query1)
# # print("A:", result1) # Kết quả trả về trực tiếp là chuỗi văn bản
#
# # # Truy vấn 2
# # query2 = "Cho tôi thông tin ngắn gọn về Bracelet For Men"
# # result2 = rag_chain.invoke(query2)
# # print("\nQ:", query2)
# # print("A:", result2)
#
# # # Truy vấn 3
# # query3 = "Cho tôi thông tin ngắn gọn về mã sản phẩm, giá, mô tả của sản phẩm vòng tay cho nam, kèm theo các gợi ý về vòng tay liên quan và giá của chúng."
# # result3 = rag_chain.invoke(query3)
# # print("\nQ:", query3)
# # print("A:", result3)
#
# import pandas as pd
# import json
# import random
#
# # ── 1. ĐỌC VÀ TIỀN XỬ LÝ DỮ LIỆU ─────────────────────────────────
# print("Đang đọc dữ liệu...")
# df1 = pd.read_csv("Etsy-dataset-sample.csv").fillna("Không có")
# df2 = pd.read_csv("etsy_handmade_2000(1).csv").fillna("Không có")
# df_all = pd.concat([df1, df2], ignore_index=True)
#
# # Làm sạch tên sản phẩm như bạn đã làm cho FAISS
# df_all['clean_title'] = df_all['title'].astype(str).apply(
#     lambda x: x.replace("FREE SHIPPING-", "").replace("FREE SHIPPING", "").split(',')[0].strip()
# )
#
# # Lấy ngẫu nhiên 23 sản phẩm độc đáo để test (sẽ tạo ra 23 x 5 = 115 câu + 1 câu OOS = 116 câu)
# random.seed(42)
# sample_df = df_all.sample(n=23, random_state=42)
#
# test_set = []
#
# print("Đang tạo bộ câu hỏi Test...")
# for index, row in sample_df.iterrows():
#     p_id = str(row['product_id'])
#     p_name = row['clean_title']
#     price = str(row['final_price'])
#     currency = str(row.get('currency', 'USD'))
#     shop = str(row.get('seller_shop_name', 'Không rõ'))
#     category = str(row.get('category_tree', 'Không rõ')).split(',')[0].strip('["\' ') # Lấy danh mục gốc
#     shipping = str(row.get('shipping_return_policies', ''))
#
#     # -- 1. PRICE INQUIRY (Hỏi giá - Đã nâng cấp gom nhóm giá) --
#     # Tìm TẤT CẢ các mức giá của sản phẩm có cùng tên này trong toàn bộ DB
#     all_prices = df_all[df_all['clean_title'] == p_name]['final_price'].unique()
#     price_str = " or ".join([f"{p} {currency}" for p in all_prices])
#
#     test_set.append({
#         "id": f"PRICE_{p_id}",
#         "intent": "price_inquiry",
#         "question": f"How much does {p_name} cost?",
#         "expected_answer": f"The price of {p_name} is {price_str}.",
#         "ground_truth_id": p_id,
#         "threshold": 0.82,
#         "note": "Kiểm tra bot có lấy đúng giá không"
#     })
#
#     # -- 2. POLICY CHECK (Hỏi chính sách) --
#     test_set.append({
#         "id": f"SHIP_{p_id}",
#         "intent": "policy_check",
#         "question": f"What is the shipping and return policy for {p_name}?",
#         "expected_answer": f"The shipping and return policies for {p_name} are: {shipping}.",
#         "ground_truth_id": p_id,
#         "threshold": 0.70,
#         "note": "Kiểm tra bot có trích chính sách đúng không"
#     })
#
#     # -- 3. PRODUCT DETAILS (Hỏi chi tiết) --
#     detail_short = str(row['item_details'])[:150] # Lấy 150 ký tự đầu làm kỳ vọng
#     test_set.append({
#         "id": f"DETAIL_{p_id}",
#         "intent": "product_details",
#         "question": f"Tell me about {p_name}",
#         "expected_answer": f"Here are the details for {p_name}: {detail_short}...",
#         "ground_truth_id": p_id,
#         "threshold": 0.70,
#         "note": "Kiểm tra bot có mô tả sản phẩm đúng không"
#     })
#
#     # -- 4. SHOP INQUIRY (Hỏi Shop bán gì - Đã nâng cấp gom nhóm) --
#     # Tìm các sản phẩm mà shop này bán (tối đa 3 sản phẩm để làm đáp án kỳ vọng)
#     shop_products = df_all[df_all['seller_shop_name'] == shop]['clean_title'].unique()[:3]
#     shop_prod_str = ", ".join(shop_products)
#
#     test_set.append({
#         "id": f"SHOP_{p_id}",
#         "intent": "shop_inquiry",
#         "question": f"What products does the shop {shop} sell?",
#         "expected_answer": f"The shop {shop} sells items such as {shop_prod_str}.",
#         "ground_truth_id": p_id,
#         "threshold": 0.72,
#         "note": "Kiểm tra bot có tìm được sản phẩm theo shop không"
#     })
#
#     # -- 5. CATEGORY SEARCH (Tìm theo danh mục) --
#     test_set.append({
#         "id": f"CAT_{p_id}",
#         "intent": "category_search",
#         "question": f"Show me handmade products in the {category} category",
#         "expected_answer": f"Here are some products in the {category} category: {p_name} - {price} {currency}.",
#         "ground_truth_id": p_id,
#         "threshold": 0.70,
#         "note": "Kiểm tra bot có tìm đúng danh mục không"
#     })
#
# # -- 6. OUT OF SCOPE (Câu hỏi ngoài lề) --
# test_set.append({
#     "id": "OOS_IPHONE",
#     "intent": "out_of_scope",
#     "question": "Do you sell iPhone 16 Pro?",
#     "expected_answer": "Sorry, I cannot find this product in our system.",
#     "ground_truth_id": "none",
#     "threshold": 0.60,
#     "note": "Kiểm tra bot có từ chối đúng câu hỏi ngoài DB không"
# })
#
# # ── 2. LƯU RA FILE JSON ──────────────────────────────────────────
# with open("etsy_test_set.json", "w", encoding="utf-8") as f:
#     json.dump(test_set, f, ensure_ascii=False, indent=4)
#
# print(f"✅ Đã tạo thành công file 'etsy_test_set.json' với {len(test_set)} câu hỏi!")
#
# import json
# import numpy as np
# import re
#
# # 1. Đọc file Test
# with open('etsy_test_set.json', 'r', encoding='utf-8') as f:
#     test_data = json.load(f)
#
# k_value = 3
# all_hits, all_precision, all_recall, all_f1, all_mrr = [], [], [], [], []
#
# # --- LỌC BỎ CÂU OUT OF SCOPE TẬN GỐC ---
# # Dùng intent để lọc sẽ an toàn tuyệt đối, không sợ sai chính tả N/A hay none
# eval_data = [item for item in test_data if item.get("intent") != "out_of_scope"]
#
# print(f"🚀 ĐANG CHẤM ĐIỂM FAISS RETRIEVER (k={k_value}) CHO {len(eval_data)} CÂU HỎI...")
#
# for item in eval_data:
#     query = item["question"]
#     true_id = str(item["ground_truth_id"]) # ID thật cần tìm
#
#     # 2. BẮT FAISS TÌM KIẾM
#     match = re.search(r'(?:shop|cửa hàng)\s+([a-zA-Z0-9_\-\s]+?)(?:\s+sell|\?|$)', query, re.IGNORECASE)
#     query_for_faiss = f"query: {query}"
#
#     if match:
#         shop_name = match.group(1).strip()
#         docs = vectorstore.similarity_search(query=query_for_faiss, k=15, filter={"shop_name": shop_name})
#         if len(docs) == 0:
#             docs = vectorstore.similarity_search(query=query_for_faiss, k=k_value)
#     else:
#         docs = vectorstore.similarity_search(query=query_for_faiss, k=k_value)
#
#     retrieved_ids = [str(doc.metadata.get('product_id', '')) for doc in docs]
#
#     # 3. CHẤM ĐIỂM "THÔNG MINH" (SEMANTIC HIT)
#     hit = 0
#     rank = 0
#     intent = item.get("intent", "")
#
#     # Ép tất cả ID về chuỗi và xóa khoảng trắng để so sánh an toàn
#     clean_retrieved_ids = [str(id).strip() for id in retrieved_ids]
#     true_id_clean = true_id.strip()
#
#     if intent in ["price_inquiry", "policy_check", "product_details"]:
#         if true_id_clean in clean_retrieved_ids:
#             hit = 1
#             rank = clean_retrieved_ids.index(true_id_clean) + 1
#
#     elif intent == "shop_inquiry":
#         parts = query.lower().split("shop")
#         if len(parts) > 1:
#             shop_target = parts[1].replace("sell", "").replace("?", "").strip()
#             for idx, doc in enumerate(docs):
#                 meta_shop = str(doc.metadata.get('seller_shop_name', '')).lower()
#                 if shop_target in meta_shop or meta_shop in shop_target:
#                     hit = 1
#                     rank = idx + 1
#                     break
#
#     elif intent == "category_search":
#         cat_match = re.search(r'in the\s+([a-zA-Z0-9_\-\s&]+?)\s+category', query, re.IGNORECASE)
#         if cat_match:
#             cat_target = cat_match.group(1).strip().lower()
#             for idx, doc in enumerate(docs):
#                 meta_cat = str(doc.metadata.get('category_tree', '')).lower()
#                 content_text = str(doc.page_content).lower()
#
#                 if cat_target in meta_cat or cat_target in content_text:
#                     hit = 1
#                     rank = idx + 1
#                     break
#
#     # -- LƯU VÀO MẢNG --
#     all_hits.append(hit)
#
#     precision = hit / len(retrieved_ids) if retrieved_ids else 0
#     all_precision.append(precision)
#
#     recall = hit / 1.0
#     all_recall.append(recall)
#
#     f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
#     all_f1.append(f1)
#
#     if hit == 1:
#         all_mrr.append(1.0 / rank)
#     else:
#         all_mrr.append(0.0)
#
# # 4. IN BÁO CÁO LUẬN VĂN
# print("\n" + "="*45)
# print(f"📊 BÁO CÁO HIỆU SUẤT TÌM KIẾM (Top-{k_value})")
# print("="*45)
# print(f"1. Accuracy (Hit Rate) : {np.mean(all_hits):.2%}")
# print(f"2. Precision@{k_value}      : {np.mean(all_precision):.2%}")
# print(f"3. Recall@{k_value}         : {np.mean(all_recall):.2%}")
# print(f"4. F1-Score            : {np.mean(all_f1):.2%}")
# print(f"5. MRR                 : {np.mean(all_mrr):.4f}")
# print("="*45)
#
# print("\n❌ DANH SÁCH CÁC CÂU FAISS TÌM TRƯỢT (Hit = 0):")
# count = 0
# for i, hit in enumerate(all_hits):
#     if hit == 0:
#         count += 1
#         print(f"{count}. Câu hỏi: {eval_data[i]['question']}")
#         print(f"   -> ID cần tìm ban đầu: {eval_data[i]['ground_truth_id']}")
#         if count >= 10:
#             break
#
# if count == 0:
#     print("🎉 TUYỆT VỜI! FAISS không trượt câu nào!")
#
# import json
# import numpy as np
# import re
#
# # 1. Đọc file Test
# with open('etsy_test_set.json', 'r', encoding='utf-8') as f:
#     test_data = json.load(f)
#
# k_value = 3 # Đặt lại k=5 cho chuẩn nhé
# all_hits, all_precision, all_recall, all_f1, all_mrr = [], [], [], [], []
#
# # --- LỌC BỎ CÂU OUT OF SCOPE (IPHONE) RA KHỎI ĐÁNH GIÁ FAISS ---
# eval_data = [item for item in test_data if item["ground_truth_id"] != "none"]
#
# print(f"🚀 ĐANG CHẤM ĐIỂM FAISS RETRIEVER (k={k_value}) CHO {len(eval_data)} CÂU HỎI...")
#
# for item in eval_data:
#     query = item["question"]
#     true_id = str(item["ground_truth_id"]) # ID thật cần tìm
#
#     # 2. BẮT FAISS TÌM KIẾM
#     match = re.search(r'(?:shop|cửa hàng)\s+([a-zA-Z0-9_\-\s]+?)(?:\s+sell|\?|$)', query, re.IGNORECASE)
#     query_for_faiss = f"query: {query}"
#
#     if match:
#         shop_name = match.group(1).strip()
#         docs = vectorstore.similarity_search(query=query_for_faiss, k=15, filter={"shop_name": shop_name})
#         if len(docs) == 0:
#             docs = vectorstore.similarity_search(query=query_for_faiss, k=k_value)
#     else:
#         docs = vectorstore.similarity_search(query=query_for_faiss, k=k_value)
#
#     retrieved_ids = [str(doc.metadata.get('product_id', '')) for doc in docs]
#
#     # 3. CHẤM ĐIỂM "THÔNG MINH" (SEMANTIC HIT)
#     hit = 0
#     rank = 0
#     intent = item.get("intent", "")
#
#     # Ép tất cả ID về chuỗi và xóa khoảng trắng để so sánh an toàn
#     clean_retrieved_ids = [str(id).strip() for id in retrieved_ids]
#     true_id_clean = true_id.strip()
#
#     if intent in ["price_inquiry", "policy_check", "product_details"]:
#         if true_id_clean in clean_retrieved_ids:
#             hit = 1
#             rank = clean_retrieved_ids.index(true_id_clean) + 1
#
#     elif intent == "shop_inquiry":
#         # Cách lấy tên shop an toàn hơn: Tìm chữ đứng sau từ "shop"
#         parts = query.lower().split("shop")
#         if len(parts) > 1:
#             # Lấy chuỗi sau từ shop, bỏ đi từ "sell" hoặc "?"
#             shop_target = parts[1].replace("sell", "").replace("?", "").strip()
#
#             for idx, doc in enumerate(docs):
#                 meta_shop = str(doc.metadata.get('seller_shop_name', '')).lower()
#                 # Nếu tên shop trong metadata chứa một phần tên shop mục tiêu (hoặc ngược lại)
#                 if shop_target in meta_shop or meta_shop in shop_target:
#                     hit = 1
#                     rank = idx + 1
#                     break
#
#     elif intent == "category_search":
#         cat_match = re.search(r'in the\s+([a-zA-Z0-9_\-\s&]+?)\s+category', query, re.IGNORECASE)
#         if cat_match:
#             cat_target = cat_match.group(1).strip().lower()
#             for idx, doc in enumerate(docs):
#                 meta_cat = str(doc.metadata.get('category_tree', '')).lower()
#                 content_text = str(doc.page_content).lower() # Lấy cả nội dung text để quét
#
#                 # Quét cả trong metadata VÀ trong nội dung văn bản
#                 if cat_target in meta_cat or cat_target in content_text:
#                     hit = 1
#                     rank = idx + 1
#                     break
#
#     # -- PHẦN BỊ THIẾU Ở CODE TRƯỚC: LƯU VÀO MẢNG --
#     all_hits.append(hit)
#
#     precision = hit / len(retrieved_ids) if retrieved_ids else 0
#     all_precision.append(precision)
#
#     recall = hit / 1.0
#     all_recall.append(recall)
#
#     f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
#     all_f1.append(f1)
#
#     if hit == 1:
#         all_mrr.append(1.0 / rank)
#     else:
#         all_mrr.append(0.0)
#
# # 4. IN BÁO CÁO LUẬN VĂN
# print("\n" + "="*45)
# print(f"📊 BÁO CÁO HIỆU SUẤT TÌM KIẾM (Top-{k_value})")
# print("="*45)
# print(f"1. Accuracy (Hit Rate) : {np.mean(all_hits):.2%}")
# print(f"2. Precision@{k_value}      : {np.mean(all_precision):.2%}")
# print(f"3. Recall@{k_value}         : {np.mean(all_recall):.2%}")
# print(f"4. F1-Score            : {np.mean(all_f1):.2%}")
# print(f"5. MRR                 : {np.mean(all_mrr):.4f}")
# print("="*45)
#
# print("\n❌ DANH SÁCH CÁC CÂU FAISS TÌM TRƯỢT (Hit = 0):")
# count = 0
# for i, hit in enumerate(all_hits):
#     if hit == 0:
#         count += 1
#         print(f"{count}. Câu hỏi: {eval_data[i]['question']}")
#         print(f"   -> ID cần tìm ban đầu: {eval_data[i]['ground_truth_id']}")
#         if count >= 10:
#             break
#
# if count == 0:
#     print("🎉 TUYỆT VỜI! FAISS không trượt câu nào!")
#
# import json
# import numpy as np
#
# # 1. Đọc file Test bạn vừa tạo
# with open('etsy_generated_test_set.json', 'r', encoding='utf-8') as f:
#     test_data = json.load(f)
#
# k_value = 5 # Số lượng document retriever lấy ra (như cấu hình của bạn)
#
# all_hits = []
# all_precision = []
# all_recall = []
# all_f1 = []
# all_mrr = []
#
# print(f"🚀 ĐANG CHẤM ĐIỂM FAISS RETRIEVER (k={k_value}) CHO {len(test_data)} CÂU HỎI...")
#
# for item in test_data:
#     query = item["question"]
#     true_id = item["ground_truth_id"] # Lấy chìa khóa vàng ra
#
#     # 2. Bắt FAISS tìm kiếm (Nhớ thêm query: cho model e5)
#     query_for_retrieval = f"query: {query}"
#     retrieved_docs = retriever.invoke(query_for_retrieval)
#
#     # Lấy danh sách ID mà FAISS tìm được
#     retrieved_ids = [str(doc.metadata.get('product_id', '')) for doc in retrieved_docs]
#
#     # 3. CHẤM ĐIỂM
#     # A. Hit (Có tìm trúng không?)
#     hit = 1 if true_id in retrieved_ids else 0
#     all_hits.append(hit)
#
#     # B. Precision
#     precision = hit / len(retrieved_ids) if retrieved_ids else 0
#     all_precision.append(precision)
#
#     # C. Recall
#     recall = hit / 1.0
#     all_recall.append(recall)
#
#     # D. F1-Score
#     f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
#     all_f1.append(f1)
#
#     # E. MRR (Nằm ở top mấy?)
#     if hit:
#         rank = retrieved_ids.index(true_id) + 1
#         all_mrr.append(1.0 / rank)
#     else:
#         all_mrr.append(0.0)
#
# # 4. IN BÁO CÁO LUẬN VĂN
# print("\n" + "="*45)
# print(f"📊 BÁO CÁO HIỆU SUẤT TÌM KIẾM (Top-{k_value})")
# print("="*45)
# print(f"1. Accuracy (Hit Rate) : {np.mean(all_hits):.2%}")
# print(f"2. Precision@{k_value}      : {np.mean(all_precision):.2%}")
# print(f"3. Recall@{k_value}         : {np.mean(all_recall):.2%}")
# print(f"4. F1-Score            : {np.mean(all_f1):.2%}")
# print(f"5. MRR                 : {np.mean(all_mrr):.4f}")
# print("="*45)
# print("\n❌ DANH SÁCH CÁC CÂU FAISS TÌM TRƯỢT (Hit = 0):")
# count = 0
# for i, hit in enumerate(all_hits):
#     if hit == 0:
#         count += 1
#         print(f"{count}. Câu hỏi: {test_data[i]['question']}")
#         print(f"   -> ID cần tìm: {test_data[i]['ground_truth_id']}")
#         if count >= 5: # Chỉ in 5 câu cho đỡ dài
#             break
#
# import pandas as pd
# import json
# import re
# from sklearn.model_selection import train_test_split
#
# # ── 1. ĐỌC VÀ GỘP 2 FILE CSV ─────────────────────────────────────
# df1 = pd.read_csv("Etsy-dataset-sample.csv").fillna("Không có")
# df2 = pd.read_csv("etsy_handmade_2000(1).csv").fillna("Không có")
# # Nếu dùng Google Drive, thay bằng:
# # df1 = pd.read_csv("/content/drive/MyDrive/KLTN/Etsy-dataset-sample.csv").fillna("Không có")
# # df2 = pd.read_csv("/content/drive/MyDrive/KLTN/etsy_handmade_2000_1_.csv").fillna("Không có")
#
# # Chỉ giữ các cột chung giữa 2 file
# common_cols = ["product_id", "title", "final_price", "currency",
#                "item_details", "shipping_return_policies",
#                "url", "seller_shop_name", "category_tree"]
#
# df_all = pd.concat([df1[common_cols], df2[common_cols]], ignore_index=True)
# df_all["product_id"] = df_all["product_id"].astype(str)
#
# # Tách test set 20% (giống notebook gốc)
# _, df_test = train_test_split(df_all, test_size=0.2, random_state=42)
# print(f"Tổng dataset: {len(df_all)} sản phẩm")
# print(f"Tập test: {len(df_test)} sản phẩm")
#
#
# # ── 2. HÀM HELPER ────────────────────────────────────────────────
# def clean_title(raw: str) -> str:
#     """Lấy tên ngắn gọn trước dấu phẩy đầu tiên."""
#     t = raw.replace("FREE SHIPPING-", "").replace("FREE SHIPPING", "").strip()
#     return t.split(",")[0].strip()
#
# def extract_price(price_val) -> str:
#     """Trả về giá dạng string sạch."""
#     try:
#         return str(float(price_val))
#     except Exception:
#         return str(price_val)
#
# def short_detail(detail: str, max_chars: int = 200) -> str:
#     """Cắt ngắn item_details để làm ground truth."""
#     return detail[:max_chars].strip()
#
# def extract_policy_keywords(policy: str) -> str:
#     """Lấy các từ khoá quan trọng trong policy."""
#     keywords = []
#     p = policy.lower()
#     if "free" in p and "ship" in p:
#         keywords.append("free shipping")
#     if "return" in p or "exchange" in p:
#         if "not accepted" in p or "no return" in p:
#             keywords.append("no returns")
#         else:
#             keywords.append("returns accepted")
#     if "made to order" in p or "business day" in p:
#         keywords.append("made to order")
#     return "; ".join(keywords) if keywords else policy[:100]
#
#
# # ── 3. TẠO TEST DATASET ──────────────────────────────────────────
# sample_size = min(30, len(df_test))
# test_subset = df_test.sample(n=sample_size, random_state=42).to_dict("records")
#
# test_dataset = []
#
# for product in test_subset:
#     pid        = str(product["product_id"])
#     title      = clean_title(str(product["title"]))
#     short_name = " ".join(title.split()[:5])       # tối đa 5 từ
#     price      = extract_price(product["final_price"])
#     currency   = str(product.get("currency", "USD"))
#     policy     = extract_policy_keywords(str(product["shipping_return_policies"]))
#     detail     = short_detail(str(product["item_details"]))
#     category   = str(product.get("category_tree", ""))
#     shop       = str(product.get("seller_shop_name", ""))
#
#     # ── Intent 1: Hỏi giá ────────────────────────────────────────
#     test_dataset.append({
#         "id":               f"TEST_{pid}_PRICE",
#         "question":         f"How much does {short_name} cost?",
#         "expected_answer":  f"{price} {currency}",
#         "intent":           "price_inquiry",
#         "ground_truth_id":  pid,
#         "threshold":        0.85,
#     })
#
#     # ── Intent 2: Hỏi chính sách giao hàng ──────────────────────
#     test_dataset.append({
#         "id":               f"TEST_{pid}_SHIP",
#         "question":         f"What is the shipping and return policy for {short_name}?",
#         "expected_answer":  policy,
#         "intent":           "policy_check",
#         "ground_truth_id":  pid,
#         "threshold":        0.72,
#     })
#
#     # ── Intent 3: Hỏi chi tiết sản phẩm ─────────────────────────
#     test_dataset.append({
#         "id":               f"TEST_{pid}_DETAIL",
#         "question":         f"Tell me the details about {short_name}",
#         "expected_answer":  detail,
#         "intent":           "product_details",
#         "ground_truth_id":  pid,
#         "threshold":        0.70,
#     })
#
#     # ── Intent 4: Hỏi theo shop ──────────────────────────────────
#     if shop and shop != "Không có":
#         test_dataset.append({
#             "id":               f"TEST_{pid}_SHOP",
#             "question":         f"What products does the shop {shop} sell?",
#             "expected_answer":  f"{title} — {price} {currency}",
#             "intent":           "shop_inquiry",
#             "ground_truth_id":  pid,
#             "threshold":        0.70,
#         })
#
#     # ── Intent 5: Hỏi theo danh mục ─────────────────────────────
#     if category and category != "Không có":
#         cat_clean = category.replace('["', "").replace('"]', "").replace('"', "")
#         test_dataset.append({
#             "id":               f"TEST_{pid}_CAT",
#             "question":         f"Show me products in the category {cat_clean}",
#             "expected_answer":  f"{title} — {price} {currency}",
#             "intent":           "category_search",
#             "ground_truth_id":  pid,
#             "threshold":        0.68,
#         })
#
# # ── 4. LƯU FILE ──────────────────────────────────────────────────
# output_json  = "etsy_gemini_test_set.json"
# output_excel = "etsy_gemini_test_set.xlsx"
#
# with open(output_json, "w", encoding="utf-8") as f:
#     json.dump(test_dataset, f, indent=2, ensure_ascii=False)
#
# pd.DataFrame(test_dataset).to_excel(output_excel, index=False)
#
# # ── 5. THỐNG KÊ ──────────────────────────────────────────────────
# df_out = pd.DataFrame(test_dataset)
# print(f"\nTổng số câu hỏi test: {len(test_dataset)}")
# print("\nPhân bổ theo intent:")
# print(df_out["intent"].value_counts().to_string())
# print(f"\nFile đã lưu: {output_json}")
# print(f"File đã lưu: {output_excel}")
#
# import json
# import numpy as np
# import pandas as pd
# from sklearn.metrics.pairwise import cosine_similarity
# from tqdm import tqdm
# import time
#
# # Load file test
# with open("etsy_gemini_test_set.json", "r", encoding="utf-8") as f:
#     test_data = json.load(f)
#
# # Chỉ lấy 30 câu, mỗi intent 6 câu
# test_30 = []
# for intent in ["price_inquiry", "policy_check", "product_details",
#                "shop_inquiry", "category_search"]:
#     subset = [x for x in test_data if x["intent"] == intent][:6]
#     test_30.extend(subset)
#
# print(f"Tổng câu test: {len(test_30)}")
# print(pd.Series([x["intent"] for x in test_30]).value_counts().to_string())
#
# # Chạy eval
# results = []
#
# for item in tqdm(test_30):
#     try:
#         bot_answer = rag_chain.invoke(item["question"])
#         time.sleep(6)  # tránh 429 — 10 requests/phút
#     except Exception as e:
#         if "429" in str(e):
#             print("Quota hit, chờ 60s...")
#             time.sleep(60)
#             bot_answer = rag_chain.invoke(item["question"])
#         else:
#             bot_answer = "ERROR"
#
#     # Chấm điểm offline — không tốn thêm API call
#     vec_bot = embeddings.embed_query(bot_answer)
#     vec_exp = embeddings.embed_query(item["expected_answer"])
#     score   = float(cosine_similarity([vec_bot], [vec_exp])[0][0])
#
#     results.append({
#         "id":         item["id"],
#         "intent":     item["intent"],
#         "question":   item["question"],
#         "expected":   item["expected_answer"],
#         "bot_answer": bot_answer,
#         "score":      round(score, 4),
#         "threshold":  item["threshold"],
#         "passed":     score >= item["threshold"],
#     })
#
# # Lưu kết quả
# df = pd.DataFrame(results)
# df.to_excel("ket_qua_gemini_30.xlsx", index=False)
#
# # Tổng kết
# print(f"\nOverall accuracy: {df['passed'].mean()*100:.1f}%")
# print("\nTheo intent:")
# print(df.groupby("intent")["passed"].mean()
#         .apply(lambda x: f"{x*100:.1f}%").to_string())
#
# import pandas as pd
# import json
#
# # 1. KHÔNG ĐỌC LẠI FILE - Dùng df_test đã tách sẵn từ trước
# print(f"✅ Sử dụng tập test đã tách sẵn: {len(df_test)} sản phẩm")
#
# # 2. TẠO TEST_SUBSET (Lấy mẫu 20 sản phẩm từ df_test)
# sample_size = min(20, len(df_test))
# test_subset = df_test.sample(n=sample_size, random_state=42).to_dict('records')
#
# # 3. KHỞI TẠO DANH SÁCH TEST
# test_dataset = []
#
# # --- PHẦN 1: CÂU HỎI CỤ THỂ (Single-item) ---
# print("⏳ Đang tạo bộ câu hỏi test cụ thể...")
# for product in test_subset:
#     clean_title = str(product['title']).replace("FREE SHIPPING-", "").replace("FREE SHIPPING", "").strip()
#     short_title = " ".join(clean_title.split()[:5])
#     prod_id = str(product['product_id'])
#
#     # Hỏi giá
#     test_dataset.append({
#         "id": f"TEST_{prod_id}_PRICE",
#         "question": f"How much is the {short_title}?",
#         "intent": "single_item_price",
#         "ground_truth_ids": [prod_id]
#     })
#
#     # Hỏi chi tiết
#     test_dataset.append({
#         "id": f"TEST_{prod_id}_DETAIL",
#         "question": f"Tell me the details about {short_title}",
#         "intent": "single_item_detail",
#         "ground_truth_ids": [prod_id]
#     })
#
# # --- PHẦN 2: CÂU HỎI DIỆN RỘNG (Broad-topic) ---
# # ✅ SỬA: Dùng df_test thay vì df để tránh lẫn dữ liệu train
# print("⏳ Đang tạo câu hỏi truy vấn diện rộng...")
#
# # Nhóm Vòng tay nam (chỉ trong tập test)
# vong_tay_nam = df_test[df_test['title'].str.contains('Bracelet For Men|Men Bracelet', case=False, na=False)]
# ids_vong_nam = vong_tay_nam['product_id'].astype(str).unique().tolist()
# test_dataset.append({
#     "id": "TEST_BROAD_MEN_BRACELET",
#     "question": "What are the prices of bracelets for men?",
#     "intent": "broad_topic_search",
#     "ground_truth_ids": ids_vong_nam
# })
#
# # Nhóm Đồ bạc 925 (chỉ trong tập test)
# bac_925 = df_test[df_test['title'].str.contains('925|Silver', case=False, na=False)]
# ids_bac = bac_925['product_id'].astype(str).unique().tolist()
# test_dataset.append({
#     "id": "TEST_BROAD_SILVER",
#     "question": "Show me some 925 sterling silver jewelry options",
#     "intent": "broad_topic_search",
#     "ground_truth_ids": ids_bac
# })
#
# # 4. LƯU RA FILE JSON
# output_file = 'etsy_comprehensive_test_set.json'
# with open(output_file, 'w', encoding='utf-8') as f:
#     json.dump(test_dataset, f, indent=2, ensure_ascii=False)
#
# print(f"\n✅ ĐÃ TẠO XONG: {output_file}")
# print(f"Tổng số câu hỏi: {len(test_dataset)}")
#
# import numpy as np
#
# # Load file test mới
# with open('etsy_comprehensive_test_set.json', 'r', encoding='utf-8') as f:
#     comprehensive_test = json.load(f)
#
# k_value = 10
# retriever_test = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": k_value})
#
# results = []
#
# print(f"🚀 ĐANG ĐÁNH GIÁ HỆ THỐNG (k={k_value})...")
#
# for item in comprehensive_test:
#     query = item["question"]
#     true_ids = set(item["ground_truth_ids"])
#
#     # Truy xuất FAISS
#     retrieved_docs = retriever_test.invoke(f"query: {query}")
#     retrieved_ids = [str(doc.metadata.get('product_id', '')) for doc in retrieved_docs]
#
#     # Tính toán giao điểm (số lượng trúng)
#     hits = [rid for rid in retrieved_ids if rid in true_ids]
#     num_hits = len(hits)
#
#     # Precision & Recall
#     precision = num_hits / k_value
#     recall = num_hits / len(true_ids) if len(true_ids) > 0 else 0
#
#     # MRR (Vị trí đúng đầu tiên)
#     mrr = 0
#     for i, rid in enumerate(retrieved_ids):
#         if rid in true_ids:
#             mrr = 1 / (i + 1)
#             break
#
#     results.append({
#         "intent": item["intent"],
#         "precision": precision,
#         "recall": recall,
#         "mrr": mrr,
#         "hit": 1 if num_hits > 0 else 0
#     })
#
# # --- IN BÁO CÁO PHÂN TÁCH THEO LOẠI ---
# res_df = pd.DataFrame(results)
#
# print("\n" + "="*45)
# print("📊 KẾT QUẢ ĐÁNH GIÁ CHI TIẾT")
# print("="*45)
#
# # Nhóm theo Intent để thấy sự khác biệt
# summary = res_df.groupby('intent').agg({
#     'hit': 'mean',
#     'mrr': 'mean',
#     'precision': 'mean',
#     'recall': 'mean'
# }).rename(columns={'hit': 'Accuracy/HitRate'})
#
# print(summary.to_string())
# print("="*45)
#
# import pandas as pd
# import matplotlib.pyplot as plt
# import ast
#
# # 1. Đọc dữ liệu từ 2 file
# df1 = pd.read_csv('etsy_handmade_2000(1).csv')
# df2 = pd.read_csv('Etsy-dataset-sample.csv')
#
# # 2. Hàm trích xuất danh mục chính
# def get_main_category(cat_str):
#     try:
#         cat_list = ast.literal_eval(str(cat_str))
#         if isinstance(cat_list, list) and len(cat_list) > 0:
#             return cat_list[0]
#     except:
#         pass
#     return "Khác"
#
# # Áp dụng cho cả 2 dataframe
# df1['Category'] = df1['category_tree'].apply(get_main_category)
# df2['Category'] = df2['category_tree'].apply(get_main_category)
# combined_df = pd.concat([df1, df2], ignore_index=True)
# # Gộp dữ liệu lại
# combined_df['Category'] = combined_df['Category'].replace('Jewellery', 'Jewelry')
#
# # Sau đó mới thống kê lại
# cat_counts = combined_df['Category'].value_counts().reset_index()
# cat_counts.columns = ['Category', 'Count']
#
# # 4. Vẽ biểu đồ cột
# plt.figure(figsize=(12, 8))
# bars = plt.bar(cat_counts['Category'], cat_counts['Count'], color='skyblue', edgecolor='navy')
#
# # Cấu hình tiêu đề và trục
# plt.title('Tổng số lượng sản phẩm theo Danh mục (Dữ liệu gộp 3000 SP)', fontsize=15)
# plt.xlabel('Danh mục sản phẩm', fontsize=12)
# plt.ylabel('Số lượng sản phẩm', fontsize=12)
# plt.xticks(rotation=45, ha='right')
#
# # --- CODE HIỂN THỊ SỐ LƯỢNG TRÊN ĐẦU MỖI CỘT ---
# for bar in bars:
#     height = bar.get_height()
#     # plt.text(tọa độ x, tọa độ y, nội dung, căn lề...)
#     plt.text(bar.get_x() + bar.get_width()/2., height + 5,
#              f'{int(height)}',
#              ha='center', va='bottom', fontsize=11, fontweight='bold')
#
# # Tối ưu hóa hiển thị để không bị mất chữ
# plt.tight_layout()
#
# # Lưu biểu đồ thành file ảnh
# plt.savefig('category_distribution_labeled.png')
# plt.show()
#
# # In bảng số liệu ra màn hình
# print(cat_counts)