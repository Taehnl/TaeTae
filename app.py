import streamlit as st
import pandas as pd
import json
import time

# -------------------- 페이지 기본 설정 --------------------
st.set_page_config(page_title="띵타이쿤 요리 이익 계산기", layout="wide")

# -------------------- 다크모드 / 라이트모드 --------------------
if "theme" not in st.session_state:
    st.session_state.theme = "dark"

toggle = st.toggle("🌙 다크 모드", value=(st.session_state.theme == "dark"))
st.session_state.theme = "dark" if toggle else "light"

if st.session_state.theme == "dark":
    st.markdown("""
        <style>
        body, .stApp { background-color: #111; color: #ddd; }
        .stDataFrame { background-color: #222; }
        </style>
        """, unsafe_allow_html=True)
else:
    st.markdown("""
        <style>
        body, .stApp { background-color: #fff; color: #111; }
        </style>
        """, unsafe_allow_html=True)

# -------------------- 상단 고정 타이머 --------------------
css = """
<style>
.fixed-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #222;
  color: #fff;
  text-align: center;
  padding: 8px;
  font-size: 16px;
  font-weight: bold;
  z-index: 999;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
body { padding-top: 60px; }
</style>
"""
st.markdown(css, unsafe_allow_html=True)

# 다음 변동 시간 (예시: 1일 16시간 10분 13초)
target_time = time.time() + (1*24*3600) + (16*3600) + (10*60) + 13

ph = st.empty()
remaining = int(target_time - time.time())
days, rem = divmod(remaining, 86400)
hours, rem = divmod(rem, 3600)
mins, secs = divmod(rem, 60)
ph.markdown(f'<div class="fixed-bar">📢 다음 요리 가격 변동까지: {days}일 {hours}시간 {mins}분 {secs}초</div>', unsafe_allow_html=True)

# -------------------- 데이터 불러오기 --------------------
with open("data/recipes.json", "r", encoding="utf-8") as f:
    recipes = json.load(f)

# -------------------- UI --------------------
st.title("🍳 띵타이쿤 요리 이익 계산기")
st.caption("💡 재료 가격을 아래에서 직접 수정하세요! (자동으로 순이익 계산됨)")

# 모든 재료 목록 수집
all_ingredients = sorted({mat for r in recipes for mat in r["재료"].keys()})

st.sidebar.header("💰 원재료 가격 설정")
prices = {}
for mat in all_ingredients:
    prices[mat] = st.sidebar.number_input(f"{mat} 가격", min_value=0, value=100, step=10)

# -------------------- 계산 --------------------
rows = []
for r in recipes:
    cost = sum(prices.get(mat, 0) * qty for mat, qty in r["재료"].items())
    profit_min = r["가격하한"] - cost
    profit_max = r["가격상한"] - cost
    rows.append({
        "요리명": r["요리명"],
        "재료비": cost,
        "하한가": r["가격하한"],
        "상한가": r["가격상한"],
        "순이익(하한)": profit_min,
        "순이익(상한)": profit_max
    })

df = pd.DataFrame(rows).sort_values("순이익(상한)", ascending=False)

# -------------------- 출력 --------------------
st.dataframe(df, use_container_width=True)
st.bar_chart(df.set_index("요리명")[["순이익(하한)", "순이익(상한)"]])

st.markdown("<br>", unsafe_allow_html=True)
st.success("✅ 가격 입력 후 바로 순이익이 계산됩니다! 다크모드/화이트모드도 가능해요 🌗")
